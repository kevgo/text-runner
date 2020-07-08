import { assert } from "chai"
import { getActionName } from "./get-action-name"

test("getActionName()", function () {
  assert.equal(getActionName("/d/text-runner/text-run/cdBack.js"), "cd-back")
})
