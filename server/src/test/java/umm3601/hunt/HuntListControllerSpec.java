package umm3601.hunt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
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
import io.javalin.validation.BodyValidator;
import io.javalin.validation.ValidationException;

import static com.mongodb.client.model.Filters.eq;

@SuppressWarnings({"MagicNumber"})
class HuntListControllerSpec {
  private HuntListController huntListController;

  private ObjectId testId;

  private static MongoClient mongoClient;
  private static MongoDatabase db;

  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Hunt>> huntListCaptor;

  @Captor
  private ArgumentCaptor<Hunt> huntCaptor;

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

  MongoCollection<Document> huntDocuments = db.getCollection("hunts");
  huntDocuments.drop();
  List<Document> testHunts = new ArrayList<>();
  testHunts.add(
    new Document()
      .append("name", "Campus hunt")
      .append("ownerId", "hunt-owner-id")
      .append("description", "hunt around the campus"));
  testHunts.add(
    new Document()
      .append("name", "Morris hunt")
      .append("ownerId", "hunt-owner-id")
      .append("description", "Hunt around Morris"));
  testHunts.add(
    new Document()
      .append("name", "Minnesota hunt")
      .append("ownerId", "hunt-owner-id-2")
      .append("description", "Hunt around Minnesota"));

  testId = new ObjectId();
  Document testHunt = new Document()
    .append("_id", testId)
    .append("name", "Science Building hunt")
    .append("ownerId", "hunt-owner-id-3")
    .append("description", "Hunt around the Science Building");

  huntDocuments.insertMany(testHunts);
  huntDocuments.insertOne(testHunt);

  huntListController = new HuntListController(db);
  }

  @Test
  void addRoutes() {
    Javalin mockServer = Mockito.mock(Javalin.class);
    huntListController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(1)).get(any(), any());
  }

  @Test
  void canGetAllHunts() throws IOException {
    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());

    huntListController.getHunts(ctx);

    verify(ctx).json(huntListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(
      db.getCollection("hunts").countDocuments(),
      huntListCaptor.getValue().size());
  }

  @Test
  void getHuntWithExistentId() throws IOException {
    String id = testId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    huntListController.getHunt(ctx);

    verify(ctx).json(huntCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals("Science Building hunt", huntCaptor.getValue().name);
    assertEquals("hunt-owner-id-3", huntCaptor.getValue().ownerId);
    assertEquals("Hunt around the Science Building", huntCaptor.getValue().description);
  }

  @Test
  void getHuntWithBadId() {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      huntListController.getHunt(ctx);
    });

    assertEquals("The requested hunt id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  @Test
  void getHuntWithNonexistentId() {
    String id = "588935f5c668650dc77df581";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      huntListController.getHunt(ctx);
    });

    assertEquals("The requested hunt was not found", exception.getMessage());
  }

  @Captor
  private ArgumentCaptor<ArrayList<HuntByOwnerId>> huntsByOwnerIdListCaptor;

  @Test
  void testGetHuntsByOwnerId() {
    huntListController.getHuntsByOwnerId(ctx);
    verify(ctx).json(huntsByOwnerIdListCaptor.capture());
    ArrayList<HuntByOwnerId> result = huntsByOwnerIdListCaptor.getValue();
    assertEquals(3, result.size());

    HuntByOwnerId testOwnerId = result.get(0);
    assertEquals("hunt-owner-id", testOwnerId._id);
    assertEquals(2, testOwnerId.count);

    HuntByOwnerId testOwnerId2 = result.get(1);
    assertEquals("hunt-owner-id-2", testOwnerId2._id);
    assertEquals(1, testOwnerId2.count);

    HuntByOwnerId testOwnerId3 = result.get(2);
    assertEquals("hunt-owner-id-3", testOwnerId3._id);
    assertEquals(1, testOwnerId3.count);
  }

  @Test
  void testGetHuntsByOwnerIdWithSortBy() {
    when(ctx.queryParam("sortBy")).thenReturn("ownerId");
    huntListController.getHuntsByOwnerId(ctx);
    verify(ctx).json(huntsByOwnerIdListCaptor.capture());
    ArrayList<HuntByOwnerId> result = huntsByOwnerIdListCaptor.getValue();
    assertEquals(3, result.size());

    HuntByOwnerId testOwnerId = result.get(0);
    assertEquals("hunt-owner-id", testOwnerId._id);
    assertEquals(2, testOwnerId.count);

    HuntByOwnerId testOwnerId2 = result.get(1);
    assertEquals("hunt-owner-id-2", testOwnerId2._id);
    assertEquals(1, testOwnerId2.count);

    HuntByOwnerId testOwnerId3 = result.get(2);
    assertEquals("hunt-owner-id-3", testOwnerId3._id);
    assertEquals(1, testOwnerId3.count);
  }

  @Test
  void testGetHuntsByOwnerIdWithSortOrderAndSortByAndFilter() {
    when(ctx.queryParam("sortOrder")).thenReturn("desc");
    when(ctx.queryParam("sortBy")).thenReturn("testOwnerId");
    huntListController.getHuntsByOwnerId(ctx);
    verify(ctx).json(huntsByOwnerIdListCaptor.capture());
    ArrayList<HuntByOwnerId> result = huntsByOwnerIdListCaptor.getValue();
    assertEquals(3, result.size());

    HuntByOwnerId testOwnerId = result.get(0);
    assertEquals("hunt-owner-id-3", testOwnerId._id);
    assertEquals(1, testOwnerId.count);
  }

  @Test
  void testAddNewHunt() {
    String testNewHunt = """
        {
          "name": "Illinois Hunt",
          "ownerId": "testOwnerId1313",
          "description": "Hunt around Illinois"
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<Hunt>(testNewHunt, Hunt.class, javalinJackson));

    huntListController.addNewHunt(ctx);
    verify(ctx).json(mapCaptor.capture());

    verify(ctx).status(HttpStatus.CREATED);

    Document addedHunt = db.getCollection("hunts")
        .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

    assertNotEquals("", addedHunt.get("_id"));
    assertEquals("Illinois Hunt", addedHunt.get("name"));
    assertEquals("testOwnerId1313", addedHunt.get("ownerId"));
    assertEquals("Hunt around Illinois", addedHunt.get("description"));
  }

  @Test
  void addInvalidDescriptionHunt() {
    String testNewHunt = """
        {
          "name": "Minnesota Hunt"
          "ownerId": "testOwnerId1213"
          "description": ""
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<>(testNewHunt, Hunt.class, javalinJackson));
    assertThrows(ValidationException.class, () -> {
      huntListController.addNewHunt(ctx);
    });
  }

  @Test
  void addInvalidName() {
    String testNewHunt = """
        {
          "name": ""
          "ownerId": "testOwnerId1413"
          "description": "Hunt around Alaska"
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<>(testNewHunt, Hunt.class, javalinJackson));
    assertThrows(ValidationException.class, () -> {
      huntListController.addNewHunt(ctx);
    });
  }

  @Test
  void testDeleteHunt() throws IOException {
    String testID = testId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

      huntListController.deleteHunt(ctx);

    assertEquals(1, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));

    huntListController.deleteHunt(ctx);

    verify(ctx).status(HttpStatus.OK);

    assertEquals(0, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void tryToDeleteNotFoundHunt() throws IOException {
    String testID = testId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

      huntListController.deleteHunt(ctx);

    assertEquals(0, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(NotFoundResponse.class, () -> {
      huntListController.deleteHunt(ctx);
    });

    verify(ctx).status(HttpStatus.NOT_FOUND);

    assertEquals(0, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));
  }
}

