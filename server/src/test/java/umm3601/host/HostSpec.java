package umm3601.host;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class HostSpec {
  private static final String FAKE_ID_STRING_1 = "fakeIdOne";
  private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

  private Host host1;
  private Host host2;

  @BeforeEach
  void setupEach() {
    host1 = new Host();
    host2 = new Host();
  }

  @Test
  void hostsWithEqualIdAreEqual() {
    host1._id = FAKE_ID_STRING_1;
    host2._id = FAKE_ID_STRING_1;

    assertTrue(host1.equals(host2));
  }

  @Test
  void hostsWithDifferentIdAreNotEqual() {
    host1._id = FAKE_ID_STRING_1;
    host2._id = FAKE_ID_STRING_2;

    assertFalse(host1.equals(host2));
  }

  @Test
  void hashCodesAreBasedOnId() {
    host1._id = FAKE_ID_STRING_1;
    host2._id = FAKE_ID_STRING_1;

    assertTrue(host1.hashCode() == host2.hashCode());
  }

  @Test
  void hostsAreNotEqualToOtherKindsOfThings() {
    host1._id = FAKE_ID_STRING_1;
    // a host is not equal to its id even though id is used for checking equality
    assertFalse(host1.equals(FAKE_ID_STRING_1));
  }
}
