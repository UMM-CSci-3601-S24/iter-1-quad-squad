package umm3601.hunt;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class Task {
  @ObjectId @Id
  public String _id;

  public String description;
  public String huntId;
  public int position;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Task)) {
      return false;
    }
    Task other = (Task) obj;
    return _id.equals(other._id);
  }

  @Override
  public int hashCode() {
    return _id.hashCode();
  }
}
