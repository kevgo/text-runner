import { callArgs } from "./call-args"
import { assert } from "chai"

suite("callArgs", function () {
  test("on Windows", function () {
    const have = callArgs("bin/text-run dynamic", "win32")
    assert.deepEqual(have, ["cmd", "/c", "bin\\text-run dynamic"])
  })
  test("on Linux", function () {
    const have = callArgs("bin/text-run dynamic", "linux")
    assert.deepEqual(have, ["bash", "-c", "bin/text-run dynamic"])
  })
})
