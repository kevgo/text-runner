import { assert } from "chai"
import { suite, test } from "node:test"

import { callArgs } from "./call-args.js"

suite("callArgs", () => {
  test("on Windows", () => {
    const have = callArgs("bin/text-runner dynamic", "win32")
    assert.deepEqual(have, ["cmd", "/c", "bin\\text-runner dynamic"])
  })
  test("on Linux", () => {
    const have = callArgs("bin/text-runner dynamic", "linux")
    assert.deepEqual(have, ["sh", "-c", "bin/text-runner dynamic"])
  })
})
