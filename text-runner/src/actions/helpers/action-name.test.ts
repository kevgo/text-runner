import { assert } from "chai"
import { actionName } from "./action-name"

test("getActionName()", function () {
  assert.equal(actionName("/users/foo/text-runner/text-run/cdBack.js"), "cd-back")
})
