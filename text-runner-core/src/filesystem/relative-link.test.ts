import { assert } from "chai"
import * as configuration from "../configuration/index"
import { AbsoluteFilePath } from "./absolute-file-path"
import { RelativeLink } from "./relative-link"

suite("RelativeLink.absolutify()", function () {
  test("no publications", function () {
    const publications = new configuration.Publications()
    const link = new RelativeLink("new.md")
    const containingFile = new AbsoluteFilePath("/one/two.md")
    const absoluteLink = link.absolutify(containingFile, publications)
    assert.equal(absoluteLink.value, "/one/new.md")
  })

  test("with publications", function () {
    const publications = configuration.Publications.fromJSON([{ localPath: "/content", publicPath: "/", publicExtension: "" }])
    const link = new RelativeLink("new.md")
    const containingFile = new AbsoluteFilePath("/content/one/two.md")
    const absoluteLink = link.absolutify(containingFile, publications)
    assert.equal(absoluteLink.value, "/one/new.md")
  })

  test("upwards link", function () {
    const publications = new configuration.Publications()
    const link = new RelativeLink("../new.md")
    const containingFile = new AbsoluteFilePath("/one/two.md")
    const absoluteLink = link.absolutify(containingFile, publications)
    assert.equal(absoluteLink.value, "/new.md")
  })
})
