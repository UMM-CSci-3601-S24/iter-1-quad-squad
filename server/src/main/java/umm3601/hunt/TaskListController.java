package umm3601.hunt;

import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.json.JavalinJackson;

public class TaskListController {

  private static final String API_TASKS = "api/tasks";
  private static final String API_TASK_BY_ID = "api/tasks/{id}";

  public TaskListController(MongoDatabase db) {
    // TODO Auto-generated constructor stub
  }

  public void getTask(Context ctx) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getTask'");
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
    server.get(API_TASK_BY_ID,this::getTask);
    // Get the list of all Tasks
    server.get(API_TASKS, this::getTasks);
  }

}
