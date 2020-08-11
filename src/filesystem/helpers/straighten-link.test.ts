import { assert } from "chai"
import { straightenLink } from "./straighten-link"

test("straightenLink", function () {
  assert.equal(straightenLink("/one/../two"), "/two")
  assert.equal(straightenLink("/one//../two"), "/two")
  assert.equal(straightenLink("/foo"), "/foo")
  assert.equal(straightenLink("/one/two/../three/../four"), "/one/four")
  assert.equal(straightenLink("/one/two/three/../../four"), "/one/four")
  assert.equal(straightenLink("/one/./././two/./"), "/one/two/")
})
