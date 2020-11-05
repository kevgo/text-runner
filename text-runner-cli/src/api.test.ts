import { assert } from "chai"

suite("JS API export", function () {
  test("exports", async function () {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cli = await import("..")
    assert.exists(cli.commands)
  })
})
