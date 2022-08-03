import { assert } from "chai"

import { files } from "../text-runner.js"

suite("AbsoluteFile", function () {
  test("directory", function () {
    const file = new files.AbsoluteFilePath("/home/acme/text-runner/README.md")
    const want = new files.AbsoluteDirPath("/home/acme/text-runner/")
    assert.deepEqual(file.directory(), want)
  })
  suite("platformified", function () {
    test("on *nix", function () {
      if (process.platform === "win32") {
        return
      }
      const absFile = new files.AbsoluteFilePath("/home/acme/textrun/README.md")
      const have = absFile.platformified()
      assert.equal(have, "/home/acme/textrun/README.md")
    })
    test("on Windows", function () {
      if (process.platform !== "win32") {
        return
      }
      const absFile = new files.AbsoluteFilePath("c:\\Users\\acme\\textrun\\README.md")
      const have = absFile.platformified()
      assert.equal(have, "c:\\Users\\acme\\textrun\\README.md")
    })
  })

  suite("toFullFile", function () {
    test("in same dir", function () {
      const file = new files.AbsoluteFilePath("/home/acme/text-runner/README.md")
      const have = file.toFullFile(new files.SourceDir("/home/acme/text-runner"))
      const want = new files.FullFilePath("README.md")
      assert.deepEqual(have, want)
    })
    test("in subdir", function () {
      const file = new files.AbsoluteFilePath("/home/acme/text-runner/README.md")
      const have = file.toFullFile(new files.SourceDir("/home/acme"))
      const want = new files.FullFilePath("text-runner/README.md")
      assert.deepEqual(have, want)
    })
  })

  suite("unixified", function () {
    test("on *nix", function () {
      if (process.platform === "win32") {
        return
      }
      const absFile = new files.AbsoluteFilePath("/home/acme/textrun/README.md")
      const have = absFile.platformified()
      assert.equal(have, "/home/acme/textrun/README.md")
    })
    test("on Windows", function () {
      if (process.platform !== "win32") {
        return
      }
      const absFile = new files.AbsoluteFilePath("c:\\Users\\acme\\textrun\\README.md")
      const have = absFile.platformified()
      assert.equal(have, "c:/Users/acme/textrun/README.md")
    })
  })
})
