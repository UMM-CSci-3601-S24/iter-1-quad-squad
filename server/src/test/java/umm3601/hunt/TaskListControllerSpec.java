package umm3601.hunt;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.json.JavalinJackson;

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
            .append("huntId", "test-hunt-id")
            .append("position", 1));
    testTasks.add(
        new Document()
            .append("description", "Take a picture of a rock")
            .append("huntId", "test-hunt-id")
            .append("position", 2));
    testTasks.add(
        new Document()
            .append("description", "Take a picture of a bird")
            .append("huntId", "test-hunt-id")
            .append("position", 3));

    testId = new ObjectId();
    Document testTask = new Document()
        .append("_id", testId)
        .append("description", "Take a picture of a road")
        .append("huntId", "test-hunt-id-2")
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
    verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
    verify(mockServer, Mockito.atLeastOnce()).delete(any(), any());
  }

  @Test
  void canGetAllTasks() throws IOException {
    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());

    taskListController.getTasks(ctx);

    verify(ctx).json(taskListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(
      db.getCollection("todos").countDocuments(),
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
    assertEquals("test-hunt-id-2", taskCaptor.getValue().huntId);
    assertEquals(1, taskCaptor.getValue().position);
  }

}
