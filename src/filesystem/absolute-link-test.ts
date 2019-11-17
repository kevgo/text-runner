import { assert } from "chai"
import { Publications } from "../configuration/publications/publications"
import { AbsoluteLink } from "./absolute-link"
import { RelativeLink } from "./relative-link"

test("AbsoluteLink.anchor()", function() {
  assert.equal(new AbsoluteLink("/foo.md#hello").anchor(), "hello")
  assert.equal(new AbsoluteLink("/foo.md").anchor(), "")
})

suite("AbsoluteLink.append()", function() {
  test("appending a normal relative link", function() {
    const link = new AbsoluteLink("/one/two/")
    const relativeLink = new RelativeLink("new.md")
    const appended = link.append(relativeLink)
    assert.equal(appended.value, "/one/two/new.md")
  })

  test("appending a relative link to parent directory", function() {
    const link = new AbsoluteLink("/one/two")
    const appended = link.append(new RelativeLink("../new"))
    assert.equal(appended.value, "/one/new")
  })
})

suite("AbsoluteLink.directory()", function() {
  const tests = [
    { desc: "file path", give: "/dir/file.md", want: "/dir/" },
    { desc: "directory path", give: "/dir/", want: "/dir/" }
  ]
  for (const tt of tests) {
    test(tt.desc, function() {
      assert.equal(new AbsoluteLink(tt.give).directory().value, tt.want)
    })
  }
})

test("AbsoluteLink.hasAnchor()", function() {
  assert.isTrue(new AbsoluteLink("/one.md#hello").hasAnchor())
  assert.isTrue(new AbsoluteLink("/#hello").hasAnchor())
  assert.isFalse(new AbsoluteLink("/one.md").hasAnchor())
  assert.isFalse(new AbsoluteLink("/").hasAnchor())
})

test("AbsoluteLink.hasExtension()", function() {
  assert.isTrue(new AbsoluteLink("/foo.md").hasExtension(".md"))
  assert.isTrue(new AbsoluteLink("/foo.md").hasExtension("md"))
  assert.isFalse(new AbsoluteLink("/foo.md").hasExtension(""))
  assert.isFalse(new AbsoluteLink("/foo/bar.html").hasExtension("md"))
  assert.isFalse(new AbsoluteLink("/foo/bar").hasExtension("md"))
})

test("AbsoluteLink.isLinkToDirectory()", function() {
  assert.isTrue(new AbsoluteLink("/foo/").isLinkToDirectory())
  assert.isFalse(new AbsoluteLink("/foo/bar.md").isLinkToDirectory())
})

suite("AbsoluteLink.localize()", function() {
  test("link to file", function() {
    const link = new AbsoluteLink("/one/two.png")
    const publications = new Publications()
    const localized = link.localize(publications, "")
    assert.equal(localized.unixified(), "one/two.png")
  })

  test("url-encoded link", function() {
    const link = new AbsoluteLink("/one%20two.png")
    const publications = new Publications()
    const localized = link.localize(publications, "")
    assert.equal(localized.unixified(), "one two.png")
  })

  test("link to mapped directory", function() {
    const link = new AbsoluteLink("/blog/two.html")
    const publications = Publications.fromJSON([
      {
        localPath: "/content/posts",
        publicExtension: "html",
        publicPath: "/blog"
      }
    ])
    const localized = link.localize(publications, "")
    assert.equal(localized.unixified(), "content/posts/two.md")
  })

  test("link with anchor to mapped directory", function() {
    const link = new AbsoluteLink("/blog/two.html#hello")
    const publications = Publications.fromJSON([
      {
        localPath: "/content/posts",
        publicExtension: "html",
        publicPath: "/blog"
      }
    ])
    const localized = link.localize(publications, "")
    assert.equal(
      localized.unixified(),
      "content/posts/two.md",
      "should remove the anchor"
    )
  })

  test("link with anchor to normal directory", function() {
    const link = new AbsoluteLink("/one/two.md#hello")
    const publications = new Publications()
    const localized = link.localize(publications, "")
    assert.equal(localized.unixified(), "one/two.md")
  })
})

test("AbsoluteLink.rebase()", function() {
  const link = new AbsoluteLink("/one/two/three.md")
  const rebased = link.rebase("/one", "/foo")
  assert.equal(rebased.value, "/foo/two/three.md")
})

suite("AbsoluteLink.withAnchor()", function() {
  test("replacing existing anchor", function() {
    assert.equal(
      new AbsoluteLink("/foo.md#hello").withAnchor("new").value,
      "/foo.md#new"
    )
  })

  test("adding an anchor", function() {
    assert.equal(
      new AbsoluteLink("/foo.md").withAnchor("new").value,
      "/foo.md#new"
    )
  })
})

test("AbsoluteLink.withExtension()", function() {
  const link = new AbsoluteLink("foo.txt")
  assert.equal(link.withExtension("md").value, "/foo.md")
  assert.equal(link.withExtension(".md").value, "/foo.md")
})

test("AbsoluteLink.withoutAnchor()", function() {
  assert.equal(
    new AbsoluteLink("/foo.md#hello").withoutAnchor().value,
    "/foo.md"
  )
  assert.equal(new AbsoluteLink("/foo.md").withoutAnchor().value, "/foo.md")
})
