import * as helpers from "./helpers"
import { assert } from "chai"
import * as path from "path"

suite("makeFullPath", function () {
  const linuxTests = {
    "text-run foo": /.+\/bin\/text-run foo$/,
    run: /.+\/bin\/text-run run$/,
  }
  const winTests = {
    "text-run foo": /.+\\bin\\text-run.cmd foo$/,
    run: /.+\\bin\\text-run.cmd run$/,
  }
  if (process.platform !== "win32") {
    for (const [give, want] of Object.entries(linuxTests)) {
      test(`Linux: ${give} --> ${want}`, function () {
        const have = helpers.makeFullPath(give, "linux")
        assert.match(have, want)
      })
    }
  }
  if (process.platform === "win32") {
    for (const [give, want] of Object.entries(winTests)) {
      test(`Windows: ${give} --> ${want}`, function () {
        const have = helpers.makeFullPath(give, "win32")
        assert.match(have, want)
      })
    }
  }
})

suite("standardizePath", function () {
  test("unix path", function () {
    assert.equal(helpers.standardizePath("foo/bar"), "foo/bar")
  })
  test("windows path", function () {
    assert.equal(helpers.standardizePath("foo\\bar"), "foo/bar")
  })
})
