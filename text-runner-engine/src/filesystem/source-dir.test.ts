import { assert } from "chai"
import { suite, test } from "node:test"

import * as files from "./index.js"

suite("sourceDir", () => {
  test("joinFullDir", () => {
    const sourceDir = new files.SourceDir("/home/acme/text-runner")
    const fullDir = new files.FullDir("src")
    const have = sourceDir.joinFullDir(fullDir)
    const want = new files.AbsoluteDirPath("/home/acme/text-runner/src")
    assert.deepEqual(have, want)
  })

  test("joinFullFile", () => {
    const sourceDir = new files.SourceDir("/home/acme/text-runner")
    const fullFile = new files.FullFilePath("src/README.md")
    const have = sourceDir.joinFullFile(fullFile)
    const want = new files.AbsoluteFilePath("/home/acme/text-runner/src/README.md")
    assert.deepEqual(have, want)
  })

  test("joinFullStr", () => {
    const sourceDir = new files.SourceDir("/home/acme/text-runner")
    const have = sourceDir.joinStr("src/README.md")
    assert.deepEqual(have, "/home/acme/text-runner/src/README.md")
  })

  suite("platformified", () => {
    test("on *nix", () => {
      if (process.platform === "win32") {
        return
      }
      const sourceDir = new files.SourceDir("/home/acme/textrun")
      const have = sourceDir.platformified()
      assert.equal(have, "/home/acme/textrun")
    })
    test("on Windows", () => {
      if (process.platform !== "win32") {
        return
      }
      const sourceDir = new files.SourceDir("c:\\Users\\acme\\textrun")
      const have = sourceDir.platformified()
      assert.equal(have, "c:\\Users\\acme\\textrun")
    })
  })

  suite("unixified", () => {
    test("on *nix", () => {
      if (process.platform === "win32") {
        return
      }
      const sourceDir = new files.SourceDir("/home/acme/textrun")
      const have = sourceDir.platformified()
      assert.equal(have, "/home/acme/textrun")
    })
    test("on Windows", () => {
      if (process.platform !== "win32") {
        return
      }
      const sourceDir = new files.SourceDir("c:\\Users\\acme\\textrun")
      const have = sourceDir.platformified()
      assert.equal(have, "c:/Users/acme/textrun")
    })
  })
})
