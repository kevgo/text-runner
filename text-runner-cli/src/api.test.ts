import { suite, test } from "node:test"
import { assert } from "chai"
import * as textRunner from "text-runner"

suite("JS API export", () => {
  test("exports", () => {
    assert.exists(textRunner.commands)
  })
})
