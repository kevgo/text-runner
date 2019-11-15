import { assert } from "chai"
import { getActionName } from "./get-action-name"

test("getActionName()", function() {
  const result = getActionName("/d/text-runner/text-run/cdBack.js")
  assert.equal(result, "cd-back")
})
