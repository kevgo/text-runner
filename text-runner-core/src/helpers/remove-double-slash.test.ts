import { assert } from "chai"

import { removeDoubleSlash } from "./remove-double-slash"

test("removeDoubleSlash", function () {
  assert.equal(removeDoubleSlash("/foo//bar/"), "/foo/bar/")
})
