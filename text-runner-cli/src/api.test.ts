import { assert } from "chai"

import cli = require("..")

suite("JS API export", function () {
  test("exports", function () {
    assert.exists(cli.commands)
  })
})
