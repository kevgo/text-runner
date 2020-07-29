import { assert } from "chai"
import { actionName } from "./action-name"

test("getActionName()", function () {
  assert.equal(actionName("/d/text-runner/text-run/cdBack.js"), "cd-back")
})
