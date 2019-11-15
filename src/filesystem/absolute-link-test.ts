import { assert } from "chai"
import { Publications } from "../configuration/publications/publications"
import { AbsoluteLink } from "./absolute-link"
import { RelativeLink } from "./relative-link"

suite("AbsoluteLink.anchor()", function() {
  const tests = [
    ["link with anchor", "/foo.md#hello", "hello"],
    ["link without anchor", "/foo.md", ""]
  ]
  for (const [description, link, expected] of tests) {
    test(description, function() {
      const absoluteLinklink = new AbsoluteLink(link)
      assert.equal(absoluteLinklink.anchor(), expected)
    })
  }
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
    ["returns the directory of the given filename", "/dir/file.md", "/dir/"],
    ["returns the given directory", "/dir/", "/dir/"]
  ]
  for (const [description, url, expected] of tests) {
    test(description, function() {
      const link = new AbsoluteLink(url)
      assert.equal(link.directory().value, expected)
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

suite("AbsoluteLink.hasExtension()", function() {
  const tests = [
    { link: "/foo.md", input: ".md", expected: true },
    { link: "/foo.md", input: "md", expected: true },
    { link: "/foo", input: "", expected: true },
    { link: "/foo/bar.html", input: "md", expected: false },
    { link: "/foo/bar", input: "md", expected: false }
  ]
  for (const tt of tests) {
    test(`${tt.link}-${tt.input}`, function() {
      const link = new AbsoluteLink(tt.link)
      assert.equal(link.hasExtension(tt.input), tt.expected)
    })
  }
})

suite("AbsoluteLink.isLinkToDirectory", function() {
  const tests = [
    { desc: "link points to directory", in: "/foo/", out: true },
    { desc: "link points to file", in: "/foo/bar.md", out: false }
  ]
  for (const tt of tests) {
    test(tt.desc, function() {
      const link = new AbsoluteLink(tt.in)
      assert.equal(link.isLinkToDirectory(), tt.out)
    })
  }
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

suite("AbsoluteLink.withAnchor()", function() {
  const tests = [
    ["link with anchor", "/foo.md#hello", "new", "/foo.md#new"],
    ["link without anchor", "/foo.md", "new", "/foo.md#new"]
  ]
  for (const [description, url, anchor, expected] of tests) {
    test(description, function() {
      const link = new AbsoluteLink(url)
      assert.equal(link.withAnchor(anchor).value, expected)
    })
  }
})

suite("withExtension", function() {
  test("returns a new AbsoluteLink with the given file extension without dot", function() {
    const link = new AbsoluteLink("foo.txt")
    const actual = link.withExtension("md")
    assert.equal(actual.value, "/foo.md")
  })

  test("returns a new AbsoluteLink with the given file extension with dot", function() {
    const link = new AbsoluteLink("foo.txt")
    const actual = link.withExtension(".md")
    assert.equal(actual.value, "/foo.md")
  })
})

suite("withoutAnchor", function() {
  const tests = [
    ["link with anchor", "/foo.md#hello", "/foo.md"],
    ["link without anchor", "/foo.md", "/foo.md"]
  ]
  for (const [description, url, expected] of tests) {
    test(description, function() {
      const link = new AbsoluteLink(url)
      assert.equal(link.withoutAnchor().value, expected)
    })
  }
})
