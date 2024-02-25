package umm3601.hunt;

public class Hunt {

  public String _id;
  public String name;
  public String description;
  public String ownerID;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Hunt)) {
      return false;
    }
    Hunt other = (Hunt) obj;
    return _id.equals(other._id);
  }

  @Override
  public int hashCode() {
    return _id.hashCode();
  }
}
