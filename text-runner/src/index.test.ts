import { assert } from "chai"

import * as tr from "./index"

suite("text-runner", function () {
  test("exports", function () {
    assert.exists(tr.commands)
  })
})
