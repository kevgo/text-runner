import { assert } from "chai"
import * as tr from "text-runner"

suite("JS API export", function () {
  test("exports", function () {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    assert.exists(tr.commands)
  })
})
