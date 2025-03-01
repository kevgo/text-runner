import { assert } from "chai"
import { suite, test } from "node:test"

import * as configuration from "../configuration/index.js"
import { FullLink } from "./full-link.js"
import { RelativeLink } from "./relative-link.js"

suite("FullLink", function () {
  test(".anchor()", function () {
    assert.equal(new FullLink("/foo.md#hello").anchor(), "hello")
    assert.equal(new FullLink("/foo.md").anchor(), "")
  })

  suite(".append()", function () {
    test("appending a normal relative link", function () {
      const link = new FullLink("/one/two/")
      const relativeLink = new RelativeLink("new.md")
      const appended = link.append(relativeLink)
      assert.equal(appended.value, "/one/two/new.md")
    })

    test("appending a relative link to parent directory", function () {
      const link = new FullLink("/one/two")
      const appended = link.append(new RelativeLink("../new"))
      assert.equal(appended.value, "/one/new")
    })
  })

  suite(".directory()", function () {
    const tests = [
      { desc: "file path", give: "/dir/file.md", want: "/dir/" },
      { desc: "directory path", give: "/dir/", want: "/dir/" }
    ]
    for (const tt of tests) {
      test(tt.desc, function () {
        assert.equal(new FullLink(tt.give).directory().value, tt.want)
      })
    }
  })

  test(".hasAnchor()", function () {
    assert.isTrue(new FullLink("/one.md#hello").hasAnchor())
    assert.isTrue(new FullLink("/#hello").hasAnchor())
    assert.isFalse(new FullLink("/one.md").hasAnchor())
    assert.isFalse(new FullLink("/").hasAnchor())
  })

  test(".hasExtension()", function () {
    assert.isTrue(new FullLink("/foo.md").hasExtension(".md"))
    assert.isTrue(new FullLink("/foo.md").hasExtension("md"))
    assert.isFalse(new FullLink("/foo.md").hasExtension(""))
    assert.isFalse(new FullLink("/foo/bar.html").hasExtension("md"))
    assert.isFalse(new FullLink("/foo/bar").hasExtension("md"))
  })

  test(".isLinkToDirectory()", function () {
    assert.isTrue(new FullLink("/foo/").isLinkToDirectory())
    assert.isFalse(new FullLink("/foo/bar.md").isLinkToDirectory())
  })

  suite(".localize()", function () {
    test("link to file", function () {
      const link = new FullLink("/one/two.png")
      const publications = new configuration.Publications()
      const localized = link.localize(publications, "")
      assert.equal(localized.unixified(), "one/two.png")
    })

    test("url-encoded link", function () {
      const link = new FullLink("/one%20two.png")
      const publications = new configuration.Publications()
      const localized = link.localize(publications, "")
      assert.equal(localized.unixified(), "one two.png")
    })

    test("link to mapped directory", function () {
      const link = new FullLink("/blog/two.html")
      const publications = configuration.Publications.fromConfigs([
        {
          localPath: "/content/posts",
          publicExtension: "html",
          publicPath: "/blog"
        }
      ])
      const localized = link.localize(publications, "")
      assert.equal(localized.unixified(), "content/posts/two.md")
    })

    test("link with anchor to mapped directory", function () {
      const link = new FullLink("/blog/two.html#hello")
      const publications = configuration.Publications.fromConfigs([
        {
          localPath: "/content/posts",
          publicExtension: "html",
          publicPath: "/blog"
        }
      ])
      const localized = link.localize(publications, "")
      assert.equal(localized.unixified(), "content/posts/two.md", "should remove the anchor")
    })

    test("link with anchor to normal directory", function () {
      const link = new FullLink("/one/two.md#hello")
      const publications = new configuration.Publications()
      const localized = link.localize(publications, "")
      assert.equal(localized.unixified(), "one/two.md")
    })
  })

  test(".rebase()", function () {
    const link = new FullLink("/one/two/three.md")
    const rebased = link.rebase("/one", "/foo")
    assert.equal(rebased.value, "/foo/two/three.md")
  })

  suite(".withAnchor()", function () {
    test("replacing existing anchor", function () {
      assert.equal(new FullLink("/foo.md#hello").withAnchor("new").value, "/foo.md#new")
    })

    test("adding an anchor", function () {
      assert.equal(new FullLink("/foo.md").withAnchor("new").value, "/foo.md#new")
    })
  })

  test(".withExtension()", function () {
    const link = new FullLink("foo.txt")
    assert.equal(link.withExtension("md").value, "/foo.md")
    assert.equal(link.withExtension(".md").value, "/foo.md")
  })

  test(".withoutAnchor()", function () {
    assert.equal(new FullLink("/foo.md#hello").withoutAnchor().value, "/foo.md")
    assert.equal(new FullLink("/foo.md").withoutAnchor().value, "/foo.md")
  })
})
