package umm3601.hunt;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class HuntListController implements Controller {

  private static final String API_HUNTS = "api/hunts";
  private static final String API_HUNTS_BY_ID = "api/hunt/{id}";
  private static final String API_ADD_HUNT = "api/hunt/new";

  static final String NAME_KEY = "name";
  static final String DESCRIPTION_KEY = "description";
  static final String OWNERID_KEY = "ownerId";

  private final JacksonMongoCollection<Hunt> huntCollection;

  public HuntListController(MongoDatabase database) {
    huntCollection = JacksonMongoCollection.builder().build(
      database,
      "hunts",
      Hunt.class,
      UuidRepresentation.STANDARD);
  }

  public void getHunt(Context ctx) {
    String id = ctx.pathParam("id");
    Hunt hunt;

    try {
      hunt = huntCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested hunt id wasn't a legal Mongo Object ID.");
    }
    if (hunt == null) {
      throw new NotFoundResponse("The requested hunt was not found");
    } else {
      ctx.json(hunt);
      ctx.status(HttpStatus.OK);
    }
  }

  public void getHunts(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);

    ArrayList<Hunt> matchingHunts = huntCollection
      .find(combinedFilter)
      .into(new ArrayList<>());

    ctx.json(matchingHunts);
    ctx.status(HttpStatus.OK);
  }

  /**
   * @param server
   * @param HuntListController
   */
  public void addRoutes(Javalin server) {
    server.get(API_HUNTS_BY_ID, this::getHunt);
    server.get(API_HUNTS, this::getHunts);
    server.post(API_ADD_HUNT, this::addNewHunt);
  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>();
    if (ctx.queryParamMap().containsKey(NAME_KEY)) {
      filters.add(eq(NAME_KEY, ctx.queryParam(NAME_KEY)));
    }
    if (ctx.queryParamMap().containsKey(DESCRIPTION_KEY)) {
      filters.add(eq(DESCRIPTION_KEY, ctx.queryParam(DESCRIPTION_KEY)));
    }
    if (ctx.queryParamMap().containsKey(OWNERID_KEY)) {
      filters.add(eq(OWNERID_KEY, ctx.queryParam(OWNERID_KEY)));
    }

    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }

  public void addNewHunt(Context ctx) {
    Hunt newHunt = ctx.bodyValidator(Hunt.class)
        .check(hunt -> hunt.description instanceof String && hunt.description != "", "Task must have a description")
        .check(hunt -> hunt.ownerId != null, "Task must have an ownerId")
        .check(hunt -> hunt.name instanceof String && hunt.name != "", "Task must have a name")
        .get();

    huntCollection.insert(newHunt);

    ctx.json(Map.of("id", newHunt._id));
    ctx.status(HttpStatus.CREATED);
  }
}
