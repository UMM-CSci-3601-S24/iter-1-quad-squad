package umm3601.hunt;

// import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class HuntListController implements Controller {

  private static final String API_HUNTS = "api/hunts";
  private static final String API_HUNTS_BY_ID = "api/hunt/{id}";
  private static final String API_ADD_HUNT = "api/hunt/new/{ownerID}";

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
    // Bson combinedFilter = constructFilter(ctx);

    ArrayList<Hunt> matchingHunts = huntCollection
      .find() // .find combinedFilter
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

  // private Bson constructFilter(Context ctx) {
  //   List<Bson> filters = new ArrayList<>();
  //   if (ctx.queryParamMap().containsKey(NAME_KEY)) {
  //     filters.add(eq(NAME_KEY, ctx.queryParam(NAME_KEY)));
  //   }
  //   if (ctx.queryParamMap().containsKey(DESCRIPTION_KEY)) {
  //     filters.add(eq(DESCRIPTION_KEY, ctx.queryParam(DESCRIPTION_KEY)));
  //   }
  //   if (ctx.queryParamMap().containsKey(OWNERID_KEY)) {
  //     filters.add(eq(OWNERID_KEY, ctx.queryParam(OWNERID_KEY)));
  //   }

  //   Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

  //   return combinedFilter;
  // }

  public void getHuntsByOwnerId(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortBy"), "_id");
    if (sortBy.equals("ownerId")) {
      sortBy = "_id";
    }

    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortOrder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ? Sorts.descending(sortBy) : Sorts.ascending(sortBy);

    ArrayList<HuntByOwnerId> matchingHunts = huntCollection
      .aggregate(
        List.of(
          new Document("$project", new Document("_id", 1).append("hunts", 1).append("ownerId", 1)),
                new Document("$group", new Document("_id", "$ownerId")
                    .append("count", new Document("$sum", 1))
                    .append("hunts", new Document("$push", new Document("_id", "$_id").append("hunt", "$hunt")))),

                new Document("$sort", sortingOrder)),
            HuntByOwnerId.class)
        .into(new ArrayList<>());

    ctx.json(matchingHunts);
    ctx.status(HttpStatus.OK);
  }

  public void addNewHunt(Context ctx) {
    Hunt newHunt = ctx.bodyValidator(Hunt.class)
        .check(hunt -> hunt.name != null, "Hunt must have a name")
        .check(hunt -> hunt.ownerId != null, "Hunt must have an ownerId")
        .check(hunt -> hunt.description instanceof String && hunt.description != "", "Hunt must have a description")
        .get();

    huntCollection.insertOne(newHunt);

    ctx.json(Map.of("id", newHunt._id));
    ctx.status(HttpStatus.CREATED);
  }

  public void deleteHunt(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = huntCollection.deleteOne(eq("_id", new ObjectId(id)));

    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
        "Unable to delete ID " + id + "; illegal ID or ID is not within system");
    }
    ctx.status(HttpStatus.OK);
  }
}
