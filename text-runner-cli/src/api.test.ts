import { assert } from "chai"
import * as textRunner from "text-runner"

suite("JS API export", function () {
  test("exports", function () {
    assert.exists(textRunner.commands)
  })
})
