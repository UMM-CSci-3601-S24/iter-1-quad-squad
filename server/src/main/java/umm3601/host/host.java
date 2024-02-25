package umm3601.host;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class host {
  @ObjectId @Id
  public String _id;

  public String username;


}
