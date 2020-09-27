import { assert } from "chai"

import { name } from "./name"

test("getActionName()", function () {
  assert.equal(name("/users/foo/text-runner/text-run/cdBack.js"), "cd-back")
})
