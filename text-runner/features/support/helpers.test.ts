import * as helpers from "./helpers"
import { assert } from "chai"
import path from "path"

suite("globalTextRunPath", function () {
  test("on unix", function () {
    if (process.platform === "win32") {
      return
    }
    const want = path.join(process.cwd(), "bin", "text-run")
    const have = helpers.globalTextRunPath("linux")
    assert.equal(have, want)
  })
  test("on windows", function () {
    if (process.platform !== "win32") {
      return
    }
    const want = "c:\\text-runner\\documentation\\examples\\bash\\node_modules\\.bin\\text-run.cmd"
    assert.equal(helpers.globalTextRunPath("win32"), want)
  })
})

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

suite("coverageCommand", function () {
  test("linux", function () {
    if (process.platform === "win32") {
      return
    }
    const have = helpers.coverageCommand("text-run foo")
    assert.match(have, /.+\/node_modules\/.bin\/nyc text-run foo$/)
  })
  test("windows", function () {
    if (process.platform !== "win32") {
      return
    }
    const have = helpers.coverageCommand("text-run foo")
    assert.match(have, /.+\\node_modules\\.bin\\nyc text-run foo$/)
  })
})
