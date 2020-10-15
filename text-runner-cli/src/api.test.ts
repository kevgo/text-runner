import { assert } from "chai"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cli = require("..")

suite("JS API export", function () {
  test("exports", function () {
    assert.exists(cli.commands)
  })
})
