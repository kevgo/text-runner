import { assert } from "chai"
import { addLeadingSlash } from "./add-leading-slash"

test("addLeadingSlash", function () {
  assert.equal(addLeadingSlash("foo"), "/foo")
  assert.equal(addLeadingSlash("/foo"), "/foo")
})
