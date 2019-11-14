import { assert } from "chai"
import { getActionName } from "./get-action-name"

describe("getActionName", function() {
  it("returns the name of the action corresponding to the given filename", function() {
    const result = getActionName("/d/text-runner/text-run/cdBack.js")
    assert.equal(result, "cd-back")
  })
})
