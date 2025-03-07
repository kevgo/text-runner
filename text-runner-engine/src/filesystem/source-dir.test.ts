import { assert } from "chai"
import { suite, test } from "node:test"

import * as files from "./index.js"

suite("sourceDir", function() {
  test("joinFullDir", function() {
    const sourceDir = new files.SourceDir("/home/acme/text-runner")
    const fullDir = new files.FullDir("src")
    const have = sourceDir.joinFullDir(fullDir)
    const want = new files.AbsoluteDirPath("/home/acme/text-runner/src")
    assert.deepEqual(have, want)
  })

  test("joinFullFile", function() {
    const sourceDir = new files.SourceDir("/home/acme/text-runner")
    const fullFile = new files.FullFilePath("src/README.md")
    const have = sourceDir.joinFullFile(fullFile)
    const want = new files.AbsoluteFilePath("/home/acme/text-runner/src/README.md")
    assert.deepEqual(have, want)
  })

  test("joinFullStr", function() {
    const sourceDir = new files.SourceDir("/home/acme/text-runner")
    const have = sourceDir.joinStr("src/README.md")
    assert.deepEqual(have, "/home/acme/text-runner/src/README.md")
  })

  suite("platformified", function() {
    test("on *nix", function() {
      if (process.platform === "win32") {
        return
      }
      const sourceDir = new files.SourceDir("/home/acme/textrun")
      const have = sourceDir.platformified()
      assert.equal(have, "/home/acme/textrun")
    })
    test("on Windows", function() {
      if (process.platform !== "win32") {
        return
      }
      const sourceDir = new files.SourceDir("c:\\Users\\acme\\textrun")
      const have = sourceDir.platformified()
      assert.equal(have, "c:\\Users\\acme\\textrun")
    })
  })

  suite("unixified", function() {
    test("on *nix", function() {
      if (process.platform === "win32") {
        return
      }
      const sourceDir = new files.SourceDir("/home/acme/textrun")
      const have = sourceDir.platformified()
      assert.equal(have, "/home/acme/textrun")
    })
    test("on Windows", function() {
      if (process.platform !== "win32") {
        return
      }
      const sourceDir = new files.SourceDir("c:\\Users\\acme\\textrun")
      const have = sourceDir.platformified()
      assert.equal(have, "c:/Users/acme/textrun")
    })
  })
})
