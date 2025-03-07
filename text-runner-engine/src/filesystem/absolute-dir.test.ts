import { assert } from "chai"
import { suite, test } from "node:test"

import * as files from "./index.js"

suite("files.AbsoluteDirPath", () => {
  test("joinStr", () => {
    const absDir = new files.AbsoluteDirPath("/home/acme/textrun")
    const have = absDir.joinStr("src")
    assert.equal(have, "/home/acme/textrun/src")
  })

  test("joinDir", () => {
    const absDir = new files.AbsoluteDirPath("/home/acme/textrun")
    const give = new files.RelativeDir("src")
    const have = absDir.joinDir(give)
    assert.equal(have.unixified(), "/home/acme/textrun/src")
  })

  suite("platformified", () => {
    test("on *nix", () => {
      if (process.platform === "win32") {
        return
      }
      const absDir = new files.AbsoluteDirPath("/home/acme/textrun")
      const have = absDir.platformified()
      assert.equal(have, "/home/acme/textrun")
    })
    test("on Windows", () => {
      if (process.platform !== "win32") {
        return
      }
      const absDir = new files.AbsoluteDirPath("c:\\Users\\acme\\textrun")
      const have = absDir.platformified()
      assert.equal(have, "c:\\Users\\acme\\textrun")
    })
  })

  suite("toFullDir", () => {
    test("subdirectory", () => {
      const absDir = new files.AbsoluteDirPath("/home/acme/text-runner/src/")
      const sourceDir = new files.SourceDir("/home/acme/text-runner/")
      const have = absDir.toFullDir(sourceDir)
      const want = new files.FullDir("src")
      assert.deepEqual(have, want)
    })
  })

  suite("unixified", () => {
    test("on *nix", () => {
      if (process.platform === "win32") {
        return
      }
      const absDir = new files.AbsoluteDirPath("/home/acme/textrun")
      const have = absDir.platformified()
      assert.equal(have, "/home/acme/textrun")
    })
    test("on Windows", () => {
      if (process.platform !== "win32") {
        return
      }
      const absDir = new files.AbsoluteDirPath("c:\\Users\\acme\\textrun")
      const have = absDir.platformified()
      assert.equal(have, "c:/Users/acme/textrun")
    })
  })
})
