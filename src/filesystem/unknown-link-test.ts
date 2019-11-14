import { assert } from "chai"
import { Publications } from "../configuration/publications/publications"
import { AbsoluteFilePath } from "./absolute-file-path"
import { UnknownLink } from "./unknown-link"
import { AbsoluteLink } from "./absolute-link"

describe("UnknownLink", function() {
  describe("absolutify", function() {
    it("returns the absolute version of the current relative link", function() {
      const link = new UnknownLink("foo/bar.md")
      const containingFile = new AbsoluteFilePath("/dir/file.md")
      const publications = new Publications()
      assert.deepEqual(
        link.absolutify(containingFile, publications),
        new AbsoluteLink("/dir/foo/bar.md")
      )
    })
    it("returns the current absolute link", function() {
      const link = new UnknownLink("/foo/bar.md")
      const containingFile = new AbsoluteFilePath("/dir/file.md")
      const publications = new Publications()
      assert.deepEqual(
        link.absolutify(containingFile, publications),
        new AbsoluteLink("/foo/bar.md")
      )
    })
  })

  describe("isAbsoluteLink", function() {
    it("returns TRUE if the link is absolute", function() {
      const link = new UnknownLink("/foo/bar")
      assert.isTrue(link.isAbsolute())
    })
    it("returns FALSE if the link is relative", function() {
      const link = new UnknownLink("foo/bar")
      assert.isFalse(link.isAbsolute())
    })
    it("returns FALSE if the link goes up", function() {
      const link = new UnknownLink("../foo/bar")
      assert.isFalse(link.isAbsolute())
    })
  })
})
