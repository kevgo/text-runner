import { makeFullPath } from "./helpers"
import { assert } from "chai"

suite("makeFullPath", function () {
  test("with text-run command", function () {
    const have = makeFullPath("text-run foo")
    assert.match(have, /.+text-runner\/bin\/text-run foo/)
  })
  test("without text-run command", function () {
    const have = makeFullPath("run")
    assert.match(have, /.+text-runner\/bin\/text-run run/)
  })
})
