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
  test("relativeFromStrDir", function () {
    const file = new files.AbsoluteFile("/home/acme/text-runner/README.md")
    const want = new files.FullFile("text-runner/README.md")
    assert.deepEqual(file.toFullFile("/home/acme/"), want)
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
