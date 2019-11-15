import { assert } from "chai"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AbsoluteLink } from "../../filesystem/absolute-link"
import { Publication } from "./publication"

suite("Publication.resolve()", function() {
  test("custom public extension", function() {
    const publication = new Publication("/content", "/", "html")
    const link = new AbsoluteLink("/1.html")

    const actual = publication.resolve(link, "")

    assert.equal(actual.unixified(), "content/1.md")
  })

  test("empty public extension", function() {
    const publication = new Publication("/content", "/", "")
    const link = new AbsoluteLink("/1")

    const actual = publication.resolve(link, "")

    assert.equal(actual.unixified(), "content/1.md")
  })

  test("link with no filename and anchor", function() {
    const publication = new Publication("/content/", "/", "")
    const link = new AbsoluteLink("/#hello")

    const actual = publication.resolve(link, "index.md")

    assert.equal(actual.unixified(), "content/index.md")
  })

  test("link with no filename in mapped folder", function() {
    const publication = new Publication("/content/", "/posts", "")
    const link = new AbsoluteLink("/posts")

    const actual = publication.resolve(link, "index.md")

    assert.equal(actual.unixified(), "content/index.md")
  })
})

suite("Publication.resolves()", function() {
  test("matching link", function() {
    const publication = new Publication("/content", "/foo", "")
    const link = new AbsoluteLink("/foo/bar")
    assert.isTrue(publication.resolves(link))
  })

  test("not matching link", function() {
    const publication = new Publication("/content", "/foo", "")
    const link = new AbsoluteLink("/one/two")
    assert.isFalse(publication.resolves(link))
  })

  test("Publication.publish()", function() {
    const publication = new Publication("/content", "/", ".html")
    const filePath = new AbsoluteFilePath("content/1.md")
    const link = publication.publish(filePath)
    assert.equal(link.value, "/1.html")
  })
})

suite("Publication.publishes()", function() {
  test("contains the given filePath exactly", function() {
    const filePath = new AbsoluteFilePath("/foo/bar")
    const publication = new Publication("/foo/bar", "", "")
    assert.isTrue(publication.publishes(filePath))
  })

  test("contains the given filePath and more", function() {
    const filePath = new AbsoluteFilePath("/foo/bar/baz")
    const publication = new Publication("/foo/bar", "", "")
    assert.isTrue(publication.publishes(filePath))
  })

  test("does not contain the given filePath", function() {
    const filePath = new AbsoluteFilePath("foo/bar/baz")
    const publication = new Publication("foo/other", "", "")
    assert.isFalse(publication.publishes(filePath))
  })
})

suite("Publication.resolve()", function() {
  test("given link doesn't match", function() {
    const publication = new Publication("/content/posts", "/blog", "html")
    const link = new AbsoluteLink("/one/two.html")

    const actual = publication.resolve(link, "")

    assert.equal(actual.unixified(), "one/two.md")
  })

  test("given link matches", function() {
    const publication = new Publication("/content/posts", "/blog", "html")
    const link = new AbsoluteLink("/blog/one.html")

    const actual = publication.resolve(link, "")

    assert.equal(actual.unixified(), "content/posts/one.md")
  })

  test("link with anchor", function() {
    const publication = new Publication("/content/posts", "/blog", "html")
    const link = new AbsoluteLink("/one/two.html#hello")

    const actual = publication.resolve(link, "")

    assert.equal(actual.unixified(), "one/two.md")
  })
})
