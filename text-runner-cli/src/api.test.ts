import { assert } from "chai"
import { suite, test } from "node:test"
import * as textRunner from "text-runner"

suite("JS API export", function() {
  test("exports", function() {
    assert.exists(textRunner.commands)
  })
})
