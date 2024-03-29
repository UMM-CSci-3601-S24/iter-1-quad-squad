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

public class TaskListController implements Controller {

  private static final String API_TASKS = "api/tasks/{huntId}";
  private static final String API_TASK_BY_ID = "api/task/{id}";
  private static final String API_ADD_TASK = "api/task/new/{huntId}";

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

    Bson sortingOrder = constructSortingOrder(ctx);

    String huntId = ctx.pathParam("huntId");
    ArrayList<Task> huntTasks;
    try {
      huntTasks = taskCollection
          .find(eq(HUNTID_KEY, huntId))
          .sort(sortingOrder)
          .into(new ArrayList<>());

    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested task id wasn't a legal Mongo Object ID.");
    }
    if (huntTasks.isEmpty()) {
      throw new NotFoundResponse("The requested task was not found");
    } else {

      ctx.json(huntTasks);
      ctx.status(HttpStatus.OK);
    }
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

    server.post(API_ADD_TASK, this::addNewTask);
  }

  private Bson constructSortingOrder(Context ctx) {
    Bson sortingOrder = Sorts.ascending("position");
    return sortingOrder;
  }

  // private Bson constructFilter(Context ctx) {
  // List<Bson> filters = new ArrayList<>();
  // if (ctx.queryParamMap().containsKey(DESCRIPTION_KEY)) {
  // filters.add(eq(DESCRIPTION_KEY, ctx.queryParam(DESCRIPTION_KEY)));
  // }
  // if (ctx.queryParamMap().containsKey(HUNTID_KEY)) {
  // filters.add(eq(HUNTID_KEY, ctx.queryParam(HUNTID_KEY)));
  // }
  // if (ctx.queryParamMap().containsKey(POSITION_KEY)) {
  // int position = ctx.queryParamAsClass(DESCRIPTION_KEY, Integer.class)
  // .check(it -> it > 0, "Position must be a positive integer")
  // .check(it -> it < REASONABLE_TASK_LIMIT, "Position must be less than " +
  // REASONABLE_TASK_LIMIT)
  // .get();
  // filters.add(eq(POSITION_KEY,
  // Integer.parseInt(ctx.queryParam(POSITION_KEY))));
  // }

  // Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

  // return combinedFilter;
  // }

  public void getTasksByHuntId(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortBy"), "_id");
    if (sortBy.equals("huntId")) {
      sortBy = "_id";
    }

    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortOrder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ? Sorts.descending(sortBy) : Sorts.ascending(sortBy);

    ArrayList<TaskByHuntId> matchingTasks = taskCollection
        .aggregate(
            List.of(
                new Document("$project", new Document("_id", 1).append("tasks", 1).append("huntId", 1)),
                new Document("$group", new Document("_id", "$huntId")
                    .append("count", new Document("$sum", 1))
                    .append("tasks", new Document("$push", new Document("_id", "$_id").append("task", "$task")))),

                new Document("$sort", sortingOrder)),
            TaskByHuntId.class)
        .into(new ArrayList<>());

    ctx.json(matchingTasks);
    ctx.status(HttpStatus.OK);

  }

  public void addNewTask(Context ctx) {
    Task newTask = ctx.bodyValidator(Task.class)
        .check(task -> task.description instanceof String && task.description != "", "Task must have a description")
        .check(task -> task.huntId != null, "Task must have a huntId")
        .check(task -> task.position > 0, "Task's position must be greater than 0")
        .get();

    taskCollection.insertOne(newTask);

    ctx.json(Map.of("id", newTask._id));
    ctx.status(HttpStatus.CREATED);
  }

  public void deleteTask(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = taskCollection.deleteOne(eq("_id", new ObjectId(id)));

    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
          "Was unable to delete ID "
              + id
              + "; perhaps illegal ID or an ID for an item not in the system?");
    }
    ctx.status(HttpStatus.OK);
  }
}
