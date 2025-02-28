import { suite, test } from "node:test"

import { assert } from "chai"

import * as files from "../filesystem/index.js"
import { Publication } from "./publication.js"

suite("Publication.resolve()", function () {
  test("custom public extension", function () {
    const publication = new Publication({ localPath: "/content", publicPath: "/", publicExtension: "html" })
    const link = new files.FullLink("/1.html")
    const localPath = publication.resolve(link, "")
    assert.equal(localPath.unixified(), "content/1.md")
  })

  test("empty public extension", function () {
    const publication = new Publication({ localPath: "/content", publicPath: "/", publicExtension: "" })
    const link = new files.FullLink("/1")
    const localPath = publication.resolve(link, "")
    assert.equal(localPath.unixified(), "content/1.md")
  })

  test("link with no filename and anchor", function () {
    const publication = new Publication({ localPath: "/content/", publicPath: "/", publicExtension: "" })
    const link = new files.FullLink("/#hello")
    const localPath = publication.resolve(link, "index.md")
    assert.equal(localPath.unixified(), "content/index.md")
  })

  test("link with no filename in mapped folder", function () {
    const publication = new Publication({ localPath: "/content/", publicPath: "/posts", publicExtension: "" })
    const link = new files.FullLink("/posts")
    const localPath = publication.resolve(link, "index.md")
    assert.equal(localPath.unixified(), "content/index.md")
  })
})

suite("Publication.resolves()", function () {
  test("matching link", function () {
    const publication = new Publication({ localPath: "/content", publicPath: "/foo", publicExtension: "" })
    const link = new files.FullLink("/foo/bar")
    assert.isTrue(publication.resolves(link))
  })

  test("non-matching link", function () {
    const publication = new Publication({ localPath: "/content", publicPath: "/foo", publicExtension: "" })
    const link = new files.FullLink("/one/two")
    assert.isFalse(publication.resolves(link))
  })
})

test("Publication.publish()", function () {
  const publication = new Publication({ localPath: "/content", publicPath: "/", publicExtension: ".html" })
  const filePath = new files.FullPath("content/1.md")
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
      const publication = new Publication({ localPath: tt.pub, publicPath: "", publicExtension: "" })
      const filePath = new files.FullPath(tt.give)
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
      const publication = new Publication({ localPath: "/content/posts", publicPath: "/blog", publicExtension: "html" })
      const link = new files.FullLink(tt.give)
      const localPath = publication.resolve(link, "")
      assert.equal(localPath.unixified(), tt.want)
    })
  }
})
