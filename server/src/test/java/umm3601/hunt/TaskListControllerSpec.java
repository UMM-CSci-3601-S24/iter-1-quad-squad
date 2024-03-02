package umm3601.hunt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.json.JavalinJackson;
import static com.mongodb.client.model.Filters.eq;

@SuppressWarnings({ "MagicNumber" })
class TaskListControllerSpec {
  private TaskListController taskListController;

  private ObjectId testId;

  private static MongoClient mongoClient;
  private static MongoDatabase db;

  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Task>> taskListCaptor;

  @Captor
  private ArgumentCaptor<Task> taskCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
        MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr)))).build());
    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  void setupEach() throws IOException {
    MockitoAnnotations.openMocks(this);

    // Setup database
    MongoCollection<Document> taskDocuments = db.getCollection("tasks");
    taskDocuments.drop();
    List<Document> testTasks = new ArrayList<>();
    testTasks.add(
        new Document()
            .append("description", "Take a picture of a tree")
            .append("huntId", "testHuntId")
            .append("position", 1));
    testTasks.add(
        new Document()
            .append("description", "Take a picture of a rock")
            .append("huntId", "testHuntId")
            .append("position", 2));
    testTasks.add(
        new Document()
            .append("description", "Take a picture of a bird")
            .append("huntId", "testHuntId")
            .append("position", 3));
    testTasks.add(
        new Document()
            .append("description", "Take a selfie")
            .append("huntId", "testHuntId2")
            .append("position", 1));

    testId = new ObjectId();
    Document testTask = new Document()
        .append("_id", testId)
        .append("description", "Take a picture of a road")
        .append("huntId", "testHuntId3")
        .append("position", 1);

    taskDocuments.insertMany(testTasks);
    taskDocuments.insertOne(testTask);

    taskListController = new TaskListController(db);
  }

  @Test
  void addRoutes() {
    Javalin mockServer = Mockito.mock(Javalin.class);
    taskListController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(1)).get(any(), any());
    // make tests here stronger when there is more to test
    // verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
    // verify(mockServer, Mockito.atLeastOnce()).delete(any(), any());
  }

  @Test
  void canGetAllTasks() throws IOException {
    when(ctx.pathParam("huntId")).thenReturn("testHuntId");

    taskListController.getTasks(ctx);

    verify(ctx).json(taskListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    Bson filter = eq("huntId", "testHuntId");
    assertEquals(
        db.getCollection("tasks").countDocuments(filter),
        taskListCaptor.getValue().size());
  }

  @Test
  void getTaskWithExistentId() throws IOException {
    String id = testId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    taskListController.getTask(ctx);

    verify(ctx).json(taskCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals("Take a picture of a road", taskCaptor.getValue().description);
    assertEquals("testHuntId3", taskCaptor.getValue().huntId);
    assertEquals(1, taskCaptor.getValue().position);
  }

  @Test
  void getTaskWithBadId() {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      taskListController.getTask(ctx);
    });

    assertEquals("The requested task id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  @Test
  void getTaskWithNonexistentId() {
    String id = "588935f5c668650dc77df581";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      taskListController.getTask(ctx);
    });

    assertEquals("The requested task was not found", exception.getMessage());
  }

  @Captor
  private ArgumentCaptor<ArrayList<TaskByHuntId>> tasksByHuntIdListCaptor;

  @Test
  void testGetTasksByHuntId() {
    // Set up the context
    taskListController.getTasksByHuntId(ctx);
    // Capture the value
    verify(ctx).json(tasksByHuntIdListCaptor.capture());
    // Check the value of the captured argument is as expected (3 hunts in test
    // data)
    ArrayList<TaskByHuntId> result = tasksByHuntIdListCaptor.getValue();
    // 3 Hunts in test data
    assertEquals(3, result.size());

    // check that testHuntId has correct id and count
    TaskByHuntId testHuntId = result.get(0);
    assertEquals("testHuntId", testHuntId._id);
    assertEquals(3, testHuntId.count);

    // check that testHuntId2 has correct id and count
    TaskByHuntId testHuntId2 = result.get(1);
    assertEquals("testHuntId2", testHuntId2._id);
    assertEquals(1, testHuntId2.count);

    // check that testHuntId3 has correct id and count
    TaskByHuntId testHuntId3 = result.get(2);
    assertEquals("testHuntId3", testHuntId3._id);
    assertEquals(1, testHuntId3.count);
  }

  @Test
  void testGetTasksByHuntIdWithSortBy() {
    // Set up the context
    when(ctx.queryParam("sortBy")).thenReturn("huntId");
    taskListController.getTasksByHuntId(ctx);
    // Capture the value
    verify(ctx).json(tasksByHuntIdListCaptor.capture());
    // Check the value of the captured argument is as expected (3 hunts in test
    // data)
    ArrayList<TaskByHuntId> result = tasksByHuntIdListCaptor.getValue();
    // 3 Hunts in test data
    assertEquals(3, result.size());

    // check that testHuntId has correct id and count
    TaskByHuntId testHuntId = result.get(0);
    assertEquals("testHuntId", testHuntId._id);
    assertEquals(3, testHuntId.count);

    // check that testHuntId2 has correct id and count
    TaskByHuntId testHuntId2 = result.get(1);
    assertEquals("testHuntId2", testHuntId2._id);
    assertEquals(1, testHuntId2.count);

    // check that testHuntId3 has correct id and count
    TaskByHuntId testHuntId3 = result.get(2);
    assertEquals("testHuntId3", testHuntId3._id);
    assertEquals(1, testHuntId3.count);
  }

  @Test
  void testGetTasksByHuntIdWithSortOrderAndSortByAndFilter() {
    // Set up the context
    when(ctx.queryParam("sortOrder")).thenReturn("desc");
    when(ctx.queryParam("sortBy")).thenReturn("huntId");
    when(ctx.queryParam("huntId")).thenReturn("testHuntId");
    taskListController.getTasksByHuntId(ctx);
    // Capture the value
    verify(ctx).json(tasksByHuntIdListCaptor.capture());
    // Check the value of the captured argument is as expected (3 hunts in test
    // data)
    ArrayList<TaskByHuntId> result = tasksByHuntIdListCaptor.getValue();
    // 3 Hunts in test data
    assertEquals(3, result.size());

    // check that testHuntId has correct id and count
    TaskByHuntId testHuntId = result.get(0);
    assertEquals("testHuntId3", testHuntId._id);
    assertEquals(1, testHuntId.count);
  }
}
