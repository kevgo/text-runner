import { assert } from "chai"

import * as files from "./index"

suite("files.AbsoluteDir", function () {
  suite("join", function () {
    test("adding a folder", function () {
      const absDir = new files.AbsoluteDir("/home/acme/textrun")
      const have = absDir.joinStr("src")
      assert.equal(have, "/home/acme/textrun/src")
    })
  })
})
