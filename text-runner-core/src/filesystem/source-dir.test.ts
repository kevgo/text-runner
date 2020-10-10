import { assert } from "chai"

import * as files from "."

suite("sourceDir", function () {
  test("joinFullDir", function () {
    const sourceDir = new files.SourceDir("/home/acme/text-runner")
    const fullDir = new files.FullDir("src")
    const have = sourceDir.joinFullDir(fullDir)
    const want = new files.AbsoluteDir("/home/acme/text-runner/src")
    assert.deepEqual(have, want)
  })
})
