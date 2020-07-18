import * as helpers from "./helpers"
import { assert } from "chai"

suite("makeFullPath", function () {
  test("with text-run command on Linux", function () {
    const have = helpers.makeFullPath("text-run foo", "linux")
    assert.match(have, /.+text-runner\/bin\/text-run foo/)
  })
  test("without text-run command on Linux", function () {
    const have = helpers.makeFullPath("run", "linux")
    assert.match(have, /.+text-runner\/bin\/text-run run/)
  })
  test("with text-run command on Linux", function () {
    const have = helpers.makeFullPath("text-run foo", "win32")
    assert.match(have, /.+text-runner\/bin\/text-run.cmd foo/)
  })
  test("without text-run command on Linux", function () {
    const have = helpers.makeFullPath("run", "win32")
    assert.match(have, /.+text-runner\/bin\/text-run.cmd run/)
  })
})

suite("standardizePath", function () {
  test("unix path", function () {
    assert.equal(helpers.standardizePath("foo/bar"), "foo/bar")
  })
  test("windows path", function () {
    assert.equal(helpers.standardizePath("foo\\bar"), "foo/bar")
  })
})
