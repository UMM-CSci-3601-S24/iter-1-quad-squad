package umm3601.hunt;

import static com.mongodb.client.model.Filters.eq;

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

  private final JacksonMongoCollection<Task> taskCollection;

  public TaskListController(MongoDatabase db) {
    // TODO Auto-generated constructor stub
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
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getTasks'");
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

}
