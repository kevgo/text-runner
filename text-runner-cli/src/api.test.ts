import { assert } from "chai"

suite("JS API export", function () {
  test("exports", function () {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cli = require("..")
    assert.exists(cli.commands)
  })
})
