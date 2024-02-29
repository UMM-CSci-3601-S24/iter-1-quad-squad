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
      .append("ownerId", "hunt-owner-id")
      .append("description", "Hunt around Minnesota"));

  testId = new ObjectId();
  Document testHunt = new Document()
    .append("_id", testId)
    .append("name", "Science Building hunt")
    .append("ownerId", "hunt-owner-id")
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
    assertEquals("hunt-owner-id", huntCaptor.getValue().ownerId);
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
}

