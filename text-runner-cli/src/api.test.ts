import { assert } from "chai"

const cli = require("..")

suite("JS API export", function () {
  test("exports", function () {
    assert.exists(cli.commands)
  })
})
