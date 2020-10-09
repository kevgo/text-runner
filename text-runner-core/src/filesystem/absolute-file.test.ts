import { assert } from "chai"

import { files } from "../text-runner"

suite("AbsoluteFile", function () {
  test("directory", function () {
    const file = new files.AbsoluteFile("/home/acme/text-runner/README.md")
    const want = new files.AbsoluteDir("/home/acme/text-runner/")
    assert.deepEqual(file.directory(), want)
  })
  suite("platformified", function () {
    test("on *nix", function () {
      if (process.platform === "win32") {
        return
      }
      const absFile = new files.AbsoluteFile("/home/acme/textrun/README.md")
      const have = absFile.platformified()
      assert.equal(have, "/home/acme/textrun/README.md")
    })
    test("on Windows", function () {
      if (process.platform !== "win32") {
        return
      }
      const absFile = new files.AbsoluteFile("c:\\Users\\acme\\textrun\\README.md")
      const have = absFile.platformified()
      assert.equal(have, "c:\\Users\\acme\\textrun\\README.md")
    })
  })

  suite("toFullFile", function () {
    test("in same dir", function () {
      const file = new files.AbsoluteFile("/home/acme/text-runner/README.md")
      const have = file.toFullFile(new files.AbsoluteDir("/home/acme/text-runner"))
      const want = new files.FullFile("README.md")
      assert.deepEqual(have, want)
    })
    test("in subdir", function () {
      const file = new files.AbsoluteFile("/home/acme/text-runner/README.md")
      const have = file.toFullFile(new files.AbsoluteDir("/home/acme"))
      const want = new files.FullFile("text-runner/README.md")
      assert.deepEqual(have, want)
    })
  })

  suite("unixified", function () {
    test("on *nix", function () {
      if (process.platform === "win32") {
        return
      }
      const absFile = new files.AbsoluteFile("/home/acme/textrun/README.md")
      const have = absFile.platformified()
      assert.equal(have, "/home/acme/textrun/README.md")
    })
    test("on Windows", function () {
      if (process.platform !== "win32") {
        return
      }
      const absFile = new files.AbsoluteFile("c:\\Users\\acme\\textrun\\README.md")
      const have = absFile.platformified()
      assert.equal(have, "c:/Users/acme/textrun/README.md")
    })
  })
})
