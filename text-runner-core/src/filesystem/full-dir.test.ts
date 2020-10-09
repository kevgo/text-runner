import { assert } from "chai"

import * as files from "."

suite("FullDir", function () {
  test(".joinStr", function () {
    const dir = new files.FullDir("/src")
    const have = dir.joinStr("README.md")
    const want = new files.FullFile("/src/README.md")
    assert.equal(have, want)
  })
})
