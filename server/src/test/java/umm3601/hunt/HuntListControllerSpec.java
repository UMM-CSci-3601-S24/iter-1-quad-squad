package umm3601.hunt;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.javalin.http.Context;
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
  private ArgumentCaptor<ArrayList<Hunt>> huntLisCaptor;

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
  }

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

  taskDocuments.insertMany(testHunts);
  taskDocuments.insertOne(testHunt);

  huntListController = new HuntListController(db);
}
