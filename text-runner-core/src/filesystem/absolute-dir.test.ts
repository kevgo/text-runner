import { assert } from "chai"

import * as files from "./index"

suite("files.AbsoluteDir", function () {
  test("joinStr", function () {
    const absDir = new files.AbsoluteDir("/home/acme/textrun")
    const have = absDir.joinStr("src")
    assert.equal(have, "/home/acme/textrun/src")
  })

  test("joinDir", function () {
    const absDir = new files.AbsoluteDir("/home/acme/textrun")
    const give = new files.RelativeDir("src")
    const have = absDir.joinDir(give)
    assert.equal(have.unixified(), "/home/acme/textrun/src")
  })

  test("joinFile", function () {
    const absDir = new files.AbsoluteDir("/home/acme/textrun")
    const give = new files.FullFile("/src/README.md")
    const have = absDir.joinFullFile(give)
    assert.equal(have.unixified(), "/home/acme/textrun/src/README.md")
  })

  suite("platformified", function () {
    test("on *nix", function () {
      if (process.platform === "win32") {
        return
      }
      const absDir = new files.AbsoluteDir("/home/acme/textrun")
      const have = absDir.platformified()
      assert.equal(have, "/home/acme/textrun")
    })
    test("on Windows", function () {
      if (process.platform !== "win32") {
        return
      }
      const absDir = new files.AbsoluteDir("c:\\Users\\acme\\textrun")
      const have = absDir.platformified()
      assert.equal(have, "c:\\Users\\acme\\textrun")
    })
  })

  suite("toFullDir", function () {
    test("subdirectory", function () {
      const absDir = new files.AbsoluteDir("/home/acme/text-runner/src/")
      const sourceDir = new files.SourceDir("/home/acme/text-runner/")
      const have = absDir.toFullDir(sourceDir)
      const want = new files.FullDir("src")
      assert.deepEqual(have, want)
    })
  })

  suite("unixified", function () {
    test("on *nix", function () {
      if (process.platform === "win32") {
        return
      }
      const absDir = new files.AbsoluteDir("/home/acme/textrun")
      const have = absDir.platformified()
      assert.equal(have, "/home/acme/textrun")
    })
    test("on Windows", function () {
      if (process.platform !== "win32") {
        return
      }
      const absDir = new files.AbsoluteDir("c:\\Users\\acme\\textrun")
      const have = absDir.platformified()
      assert.equal(have, "c:/Users/acme/textrun")
    })
  })
})
