import { assert } from "chai"

import { FullPath } from "../filesystem/full-path"
import { AbsoluteLink } from "../filesystem/absolute-link"
import { Publication } from "./publication"

suite("Publication.resolve()", function () {
  test("custom public extension", function () {
    const publication = new Publication("/content", "/", "html")
    const link = new AbsoluteLink("/1.html")
    const localPath = publication.resolve(link, "")
    assert.equal(localPath.unixified(), "content/1.md")
  })

  test("empty public extension", function () {
    const publication = new Publication("/content", "/", "")
    const link = new AbsoluteLink("/1")
    const localPath = publication.resolve(link, "")
    assert.equal(localPath.unixified(), "content/1.md")
  })

  test("link with no filename and anchor", function () {
    const publication = new Publication("/content/", "/", "")
    const link = new AbsoluteLink("/#hello")
    const localPath = publication.resolve(link, "index.md")
    assert.equal(localPath.unixified(), "content/index.md")
  })

  test("link with no filename in mapped folder", function () {
    const publication = new Publication("/content/", "/posts", "")
    const link = new AbsoluteLink("/posts")
    const localPath = publication.resolve(link, "index.md")
    assert.equal(localPath.unixified(), "content/index.md")
  })
})

suite("Publication.resolves()", function () {
  test("matching link", function () {
    const publication = new Publication("/content", "/foo", "")
    const link = new AbsoluteLink("/foo/bar")
    assert.isTrue(publication.resolves(link))
  })

  test("non-matching link", function () {
    const publication = new Publication("/content", "/foo", "")
    const link = new AbsoluteLink("/one/two")
    assert.isFalse(publication.resolves(link))
  })
})

test("Publication.publish()", function () {
  const publication = new Publication("/content", "/", ".html")
  const filePath = new FullPath("content/1.md")
  const link = publication.publish(filePath)
  assert.equal(link.value, "/1.html")
})

suite("Publication.publishes()", function () {
  const tests = [
    { pub: "/foo/bar", give: "/foo/bar", want: true },
    { pub: "/foo/bar", give: "/foo/bar/baz", want: true },
    { pub: "/foo/other", give: "/foo/bar/baz", want: false },
  ]
  for (const tt of tests) {
    test(`${tt.give}-${tt.pub}`, function () {
      const publication = new Publication(tt.pub, "", "")
      const filePath = new FullPath(tt.give)
      assert.equal(publication.publishes(filePath), tt.want)
    })
  }
})

suite("Publication.resolve()", function () {
  const tests = [
    { desc: "other link", give: "/one/two.html", want: "one/two.md" },
    { desc: "published", give: "/blog/one.html", want: "content/posts/one.md" },
    { desc: "with anchor", give: "/one/two.html#hello", want: "one/two.md" },
  ]
  for (const tt of tests) {
    test(tt.desc, function () {
      const publication = new Publication("/content/posts", "/blog", "html")
      const link = new AbsoluteLink(tt.give)
      const localPath = publication.resolve(link, "")
      assert.equal(localPath.unixified(), tt.want)
    })
  }
})
