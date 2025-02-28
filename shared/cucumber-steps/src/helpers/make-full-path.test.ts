import { assert } from "chai"
import { suite, test } from "node:test"
import * as util from "util"

import { makeFullPath } from "./make-full-path.js"

suite("makeFullPath", function () {
  const linuxTests = {
    "text-run foo": /.+\/node_modules\/.bin\/text-run foo$/,
    run: /.+\/node_modules\/.bin\/text-run run$/,
  }
  const winTests = {
    "text-run foo": /.+\\bin\\text-run.cmd foo$/,
    run: /.+\\bin\\text-run.cmd run$/,
  }
  if (process.platform !== "win32") {
    for (const [give, want] of Object.entries(linuxTests)) {
      test(`Linux: ${give} --> ${util.inspect(want)}`, function () {
        const have = makeFullPath(give, "linux")
        assert.match(have, want)
      })
    }
  }
  if (process.platform === "win32") {
    for (const [give, want] of Object.entries(winTests)) {
      test(`Windows: ${give} --> ${util.inspect(want)}`, function () {
        const have = makeFullPath(give, "win32")
        assert.match(have, want)
      })
    }
  }
})
