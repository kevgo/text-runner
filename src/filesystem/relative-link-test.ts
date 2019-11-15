import { assert } from "chai"
import { Publications } from "../configuration/publications/publications"
import { AbsoluteFilePath } from "./absolute-file-path"
import { RelativeLink } from "./relative-link"

suite("RelativeLink.absolutify()", function() {
  test("no publications", function() {
    const publications = new Publications()
    const link = new RelativeLink("new.md")
    const containingFile = new AbsoluteFilePath("/one/two.md")
    const actual = link.absolutify(containingFile, publications)
    assert.equal(actual.value, "/one/new.md")
  })

  it("with publications", function() {
    const publications = Publications.fromJSON([
      { localPath: "/content", publicPath: "/", publicExtension: "" }
    ])
    const link = new RelativeLink("new.md")
    const containingFile = new AbsoluteFilePath("/content/one/two.md")
    const actual = link.absolutify(containingFile, publications)
    assert.equal(actual.value, "/one/new.md")
  })

  it("upwards link", function() {
    const publications = new Publications()
    const link = new RelativeLink("../new.md")
    const containingFile = new AbsoluteFilePath("/one/two.md")
    const actual = link.absolutify(containingFile, publications)
    assert.equal(actual.value, "/new.md")
  })
})
