import { suite, test } from "node:test"

import { assert } from "chai"

import * as configuration from "../configuration/index.js"
import * as files from "./index.js"

suite("RelativeLink", function () {
  suite(".absolutify()", function () {
    test("no publications", function () {
      const publications = new configuration.Publications()
      const link = new files.RelativeLink("new.md")
      const containingFile = new files.FullFilePath("/one/two.md")
      const location = new files.Location(new files.SourceDir(""), containingFile, 1)
      const absoluteLink = link.absolutify(location, publications)
      assert.equal(absoluteLink.value, "/one/new.md")
    })

    test("with publications", function () {
      const publications = configuration.Publications.fromConfigs([
        { localPath: "/content", publicPath: "/", publicExtension: "" },
      ])
      const link = new files.RelativeLink("new.md")
      const containingFile = new files.FullFilePath("/content/one/two.md")
      const location = new files.Location(new files.SourceDir(""), containingFile, 1)
      const absoluteLink = link.absolutify(location, publications)
      assert.equal(absoluteLink.value, "/one/new.md")
    })

    test("upwards link", function () {
      const publications = new configuration.Publications()
      const link = new files.RelativeLink("../new.md")
      const containingFile = new files.FullFilePath("/one/two.md")
      const location = new files.Location(new files.SourceDir(""), containingFile, 1)
      const absoluteLink = link.absolutify(location, publications)
      assert.equal(absoluteLink.value, "/new.md")
    })
  })
})
