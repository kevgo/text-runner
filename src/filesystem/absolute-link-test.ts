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
    const actual = link.append(relativeLink)
    assert.equal(actual.value, "/one/two/new.md")
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

suite("AbsoluteLink.hasAnchor()", function() {
  test("link to a file with anchor", function() {
    const link = new AbsoluteLink("/one.md#hello")
    assert.isTrue(link.hasAnchor())
  })
  test("link to a directory with anchor", function() {
    const link = new AbsoluteLink("/#hello")
    assert.isTrue(link.hasAnchor())
  })
  test("link to a file without anchor", function() {
    const link = new AbsoluteLink("/one.md")
    assert.isFalse(link.hasAnchor())
  })
  test("link to a directory without anchor", function() {
    const link = new AbsoluteLink("/")
    assert.isFalse(link.hasAnchor())
  })
})

test("AbsoluteLink.hasExtension()", function() {
  assert.isTrue(new AbsoluteLink("/foo.md").hasExtension(".md"))
  assert.isTrue(new AbsoluteLink("/foo.md").hasExtension("md"))
  assert.isFalse(new AbsoluteLink("/foo.md").hasExtension(""))
  assert.isFalse(new AbsoluteLink("/foo/bar.html").hasExtension("md"))
  assert.isFalse(new AbsoluteLink("/foo/bar").hasExtension("md"))
})

test("AbsoluteLink.isLinkToDirectory", function() {
  assert.isTrue(new AbsoluteLink("/foo/").isLinkToDirectory())
  assert.isFalse(new AbsoluteLink("/foo/bar.md").isLinkToDirectory())
})

suite("AbsoluteLink.localize", function() {
  test("link to file", function() {
    const link = new AbsoluteLink("/one/two.png")
    const publications = new Publications()

    const actual = link.localize(publications, "")

    assert.equal(actual.unixified(), "one/two.png")
  })

  test("url-encoded link", function() {
    const link = new AbsoluteLink("/one%20two.png")
    const publications = new Publications()
    const actual = link.localize(publications, "")
    assert.equal(actual.unixified(), "one two.png")
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
    const actual = link.localize(publications, "")
    assert.equal(actual.unixified(), "content/posts/two.md")
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
    const actual = link.localize(publications, "")
    assert.equal(
      actual.unixified(),
      "content/posts/two.md",
      "should remove the anchor"
    )
  })

  test("link with anchor to normal directory", function() {
    const link = new AbsoluteLink("/one/two.md#hello")
    const publications = new Publications()
    const actual = link.localize(publications, "")
    assert.equal(actual.unixified(), "one/two.md")
  })
})

test("AbsoluteLink.rebase()", function() {
  const link = new AbsoluteLink("/one/two/three.md")
  const actual = link.rebase("/one", "/foo")
  assert.equal(actual.value, "/foo/two/three.md")
})

test("AbsoluteLink.withAnchor()", function() {
  assert.equal(
    new AbsoluteLink("/foo.md#hello").withAnchor("new").value,
    "/foo.md#new",
    "link with existing anchor"
  )
  assert.equal(
    new AbsoluteLink("/foo.md").withAnchor("new").value,
    "/foo.md#new",
    "link without anchor"
  )
})

suite("AbsoluteLink.withExtension()", function() {
  const tests = [
    { file: "foo.txt", ext: "md", want: "/foo.md" },
    { file: "foo.txt", ext: ".md", want: "/foo.md" }
  ]
  for (const tt of tests) {
    test(`${tt.file}-${tt.ext}`, function() {
      const link = new AbsoluteLink(tt.file)
      const actual = link.withExtension(tt.ext)
      assert.equal(actual.value, tt.want)
    })
  }
})

test("AbsoluteLink.withoutAnchor()", function() {
  assert.equal(
    new AbsoluteLink("/foo.md#hello").withoutAnchor().value,
    "/foo.md",
    "link with anchor"
  )
  assert.equal(
    new AbsoluteLink("/foo.md").withoutAnchor().value,
    "/foo.md",
    "link without anchor"
  )
})
