package umm3601.host;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings("checkstyle:visibilitymodifier")
public class Host {
  @ObjectId @Id
  @SuppressWarnings({"MemberName"})
  public String _id;

  public String username;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Host)) {
      return false;
    }
    Host other = (Host) obj;
    return _id.equals(other._id);
  }

  @Override
  public int hashCode() {
    return _id.hashCode();
  }
}
