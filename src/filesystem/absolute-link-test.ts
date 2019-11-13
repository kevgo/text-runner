import { assert } from "chai"
import { Publications } from "../configuration/publications/publications"
import { AbsoluteLink } from "./absolute-link"
import { RelativeLink } from "./relative-link"

describe("AbsoluteLink", function() {
  it("prepends a forward slash", function() {
    const link = new AbsoluteLink("foo/bar")
    assert.equal(link.value, "/foo/bar")
  })

  it("converts Windows paths to forward slashes", function() {
    const link = new AbsoluteLink("\\foo\\bar")
    assert.equal(link.value, "/foo/bar")
  })

  describe("anchor", function() {
    const tests = [
      ["link with anchor", "/foo.md#hello", "hello"],
      ["link without anchor", "/foo.md", ""]
    ]
    for (const [description, link, expected] of tests) {
      it(description, function() {
        const absoluteLinklink = new AbsoluteLink(link)
        assert.equal(absoluteLinklink.anchor(), expected)
      })
    }
  })

  describe("append", function() {
    it("adds the given link to the given directory link", function() {
      const link = new AbsoluteLink("/one/two/")
      const relativeLink = new RelativeLink("new.md")
      const actual = link.append(relativeLink)
      assert.equal(actual.value, "/one/two/new.md")
    })
    it("straightens out the path", function() {
      const link = new AbsoluteLink("/one/two")
      const appended = link.append(new RelativeLink("../new"))
      assert.equal(appended.value, "/one/new")
    })
  })

  describe("directory", function() {
    const testData = [
      ["returns the directory of the given filename", "/dir/file.md", "/dir/"],
      ["returns the given directory", "/dir/", "/dir/"]
    ]
    for (const [description, url, expected] of testData) {
      it(description, function() {
        const link = new AbsoluteLink(url)
        assert.equal(link.directory().value, expected)
      })
    }
  })

  describe("hasAnchor", function() {
    it("returns TRUE if the link points to a file with anchor", function() {
      const link = new AbsoluteLink("/one.md#hello")
      assert.isTrue(link.hasAnchor())
    })
    it("returns TRUE if the link points to a directory with anchor", function() {
      const link = new AbsoluteLink("/#hello")
      assert.isTrue(link.hasAnchor())
    })
    it("returns FALSE if the link points to a file without anchor", function() {
      const link = new AbsoluteLink("/one.md")
      assert.isFalse(link.hasAnchor())
    })
    it("returns FALSE if the link points to a directory without anchor", function() {
      const link = new AbsoluteLink("/")
      assert.isFalse(link.hasAnchor())
    })
  })

  describe("hasExtension", function() {
    it("returns TRUE if the link has the given extension with period", function() {
      const link = new AbsoluteLink("/foo.md")
      assert.isTrue(link.hasExtension(".md"))
    })
    it("returns TRUE if the link has the given extension without period", function() {
      const link = new AbsoluteLink("/foo.md")
      assert.isTrue(link.hasExtension("md"))
    })
    it("returns TRUE for matches with empty extension", function() {
      const link = new AbsoluteLink("/foo")
      assert.isTrue(link.hasExtension(""))
    })
    it("returns FALSE if the link has a different extension", function() {
      const link = new AbsoluteLink("/foo/bar.html")
      assert.isFalse(link.hasExtension("md"))
    })
    it("returns FALSE if the link has no extension", function() {
      const link = new AbsoluteLink("/foo/bar")
      assert.isFalse(link.hasExtension("md"))
    })
  })

  describe("isLinkToDirectory", function() {
    it("returns TRUE if the link points to a directory", function() {
      const link = new AbsoluteLink("/foo/")
      assert.isTrue(link.isLinkToDirectory())
    })
    it("returns FALSE if the link does not point to a directory", function() {
      const link = new AbsoluteLink("/foo/bar.md")
      assert.isFalse(link.isLinkToDirectory())
    })
  })

  describe("localize", function() {
    it("returns the local file path of this link", function() {
      const link = new AbsoluteLink("/one/two.png")
      const publications = new Publications()
      const actual = link.localize(publications, "")
      assert.equal(actual.unixified(), "one/two.png")
    })
    it("url-decodes the file path", function() {
      const link = new AbsoluteLink("/one%20two.png")
      const publications = new Publications()
      const actual = link.localize(publications, "")
      assert.equal(actual.unixified(), "one two.png")
    })
    it("applies the publication", function() {
      const link = new AbsoluteLink("/blog/two.html")
      const publications = Publications.fromJSON([
        {
          localPath: "/content/posts",
          publicExtension: "html",
          publicPath: "/blog"
        }
      ])
      const actual = link.localize(publications, "")
      assert.equal(actual.unixified(), "content/posts/two.md")
    })
    it("removes the anchor in publications", function() {
      const link = new AbsoluteLink("/blog/two.html#hello")
      const publications = Publications.fromJSON([
        {
          localPath: "/content/posts",
          publicExtension: "html",
          publicPath: "/blog"
        }
      ])
      const actual = link.localize(publications, "")
      assert.equal(actual.unixified(), "content/posts/two.md")
    })
    it("removes the anchor in non-published links", function() {
      const link = new AbsoluteLink("/one/two.md#hello")
      const publications = new Publications()
      const actual = link.localize(publications, "")
      assert.equal(actual.unixified(), "one/two.md")
    })
  })

  describe("urlDecoded", function() {
    it("returns the link url decoded", function() {
      const link = new AbsoluteLink("/one%20two.png")
      const publications = new Publications()
      const actual = link.localize(publications, "")
      assert.equal(actual.unixified(), "one two.png")
    })
  })

  describe("rebase", function() {
    it("replaces the old base with the new", function() {
      const link = new AbsoluteLink("/one/two/three.md")
      const actual = link.rebase("/one", "/foo")
      assert.equal(actual.value, "/foo/two/three.md")
    })
  })

  describe("withAnchor", function() {
    const tests = [
      ["link with anchor", "/foo.md#hello", "new", "/foo.md#new"],
      ["link without anchor", "/foo.md", "new", "/foo.md#new"]
    ]
    for (const [description, url, anchor, expected] of tests) {
      it(description, function() {
        const link = new AbsoluteLink(url)
        assert.equal(link.withAnchor(anchor).value, expected)
      })
    }
  })

  describe("withExtension", function() {
    it("returns a new AbsoluteLink with the given file extension without dot", function() {
      const link = new AbsoluteLink("foo.txt")
      const actual = link.withExtension("md")
      assert.equal(actual.value, "/foo.md")
    })

    it("returns a new AbsoluteLink with the given file extension with dot", function() {
      const link = new AbsoluteLink("foo.txt")
      const actual = link.withExtension(".md")
      assert.equal(actual.value, "/foo.md")
    })
  })

  describe("withoutAnchor", function() {
    const tests = [
      ["link with anchor", "/foo.md#hello", "/foo.md"],
      ["link without anchor", "/foo.md", "/foo.md"]
    ]
    for (const [description, url, expected] of tests) {
      it(description, function() {
        const link = new AbsoluteLink(url)
        assert.equal(link.withoutAnchor().value, expected)
      })
    }
  })
})
