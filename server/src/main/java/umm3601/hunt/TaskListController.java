package umm3601.hunt;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.json.JavalinJackson;

public class TaskListController {

  private static final String API_TASKS = "api/tasks";
  private static final String API_TASK_BY_ID = "api/tasks/{id}";

  static final String DESCRIPTION_KEY = "description";
  static final String HUNTID_KEY = "huntId";
  static final String POSITION_KEY = "position";

  private static final int REASONABLE_TASK_LIMIT = 100;

  private final JacksonMongoCollection<Task> taskCollection;

  public TaskListController(MongoDatabase database) {
    taskCollection = JacksonMongoCollection.builder().build(
      database,
      "tasks",
      Task.class,
      UuidRepresentation.STANDARD);
  }

  public void getTask(Context ctx) {
    String id = ctx.pathParam("id");
    Task task;

    try {
      task = taskCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested task id wasn't a legal Mongo Object ID.");
    }
    if (task == null) {
      throw new NotFoundResponse("The requested task was not found");
    } else {
      ctx.json(task);
      ctx.status(HttpStatus.OK);
    }
  }

  public void getTasks(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);

    ArrayList<Task> matchingTasks = taskCollection
      .find(combinedFilter)
      .into(new ArrayList<>());

    ctx.json(matchingTasks);
    ctx.status(HttpStatus.OK);
  }

  /**
   * @param server
   * @param TaskListController
   */
  public void addRoutes(Javalin server) {
    // Get the specified Task (by ID)
    server.get(API_TASK_BY_ID, this::getTask);
    // Get the list of all Tasks
    server.get(API_TASKS, this::getTasks);
  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>();
    if (ctx.queryParamMap().containsKey(DESCRIPTION_KEY)) {
      filters.add(eq(DESCRIPTION_KEY, ctx.queryParam(DESCRIPTION_KEY)));
    }
    if (ctx.queryParamMap().containsKey(HUNTID_KEY)) {
      filters.add(eq(HUNTID_KEY, ctx.queryParam(HUNTID_KEY)));
    }
    if (ctx.queryParamMap().containsKey(POSITION_KEY)) {
      int position = ctx.queryParamAsClass(DESCRIPTION_KEY, Integer.class)
      .check(it -> it > 0, "Position must be a positive integer")
      .check(it -> it < REASONABLE_TASK_LIMIT, "Position must be less than " + REASONABLE_TASK_LIMIT)
      .get();
      filters.add(eq(POSITION_KEY, Integer.parseInt(ctx.queryParam(POSITION_KEY))));
    }

    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }

}
