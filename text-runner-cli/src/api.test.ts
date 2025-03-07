import { assert } from "chai"
import { suite, test } from "node:test"
import * as textRunner from "text-runner"

suite("JS API export", () => {
  test("exports", () => {
    assert.exists(textRunner.commands)
  })
})
