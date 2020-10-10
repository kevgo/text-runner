import { assert } from "chai"

import * as configuration from "../configuration/index"
import { files } from "../text-runner"
import { FullPath } from "./full-path"

suite("FullPath", function () {
  test(".append()", function () {
    const filePath = new FullPath("/one")
    const appended = filePath.append("two")
    assert.equal(appended.unixified(), "one/two")
  })

  suite(".directory()", function () {
    const tests = [
      { desc: "Unix directory", give: "/foo/bar/", want: "foo/bar/" },
      { desc: "Unix file path", give: "/foo/bar/baz.md", want: "foo/bar/" },
      { desc: "Windows directory", give: "/foo/bar/", want: "foo/bar/" },
      { desc: "Windows file path", give: "\\foo\\bar\\baz.md", want: "foo/bar/" },
    ]
    for (const tt of tests) {
      test(tt.desc, function () {
        const file = new FullPath(tt.give)
        assert.equal(file.directory().unixified(), tt.want)
      })
    }
  })

  test(".extName()", function () {
    assert.equal(new FullPath("/one.md").extName(), ".md")
    assert.equal(new FullPath("/one").extName(), "")
  })

  suite(".isDirectory()", function () {
    const tests = [
      { desc: "Unix directory", give: "/foo/bar/", want: true },
      { desc: "Unix file path", give: "/foo/bar/baz.md", want: false },
      { desc: "Windows directory", give: "/foo/bar/", want: true },
      { desc: "Windows file path", give: "\\foo\\bar\\baz.md", want: false },
    ]
    for (const tt of tests) {
      test(tt.desc, function () {
        assert.equal(new FullPath(tt.give).isDirectory(), tt.want)
      })
    }
  })

  test(".joinStr()", function () {
    const fullPath = new files.FullPath("/one/two")
    const have = fullPath.joinStr("three")
    const want = "one/two/three"
    assert.deepEqual(have, want)
  })

  test(".unixified()", function () {
    assert.equal(new FullPath("/foo/bar").unixified(), "foo/bar")
    assert.equal(new FullPath("\\foo/bar\\baz").unixified(), "foo/bar/baz")
  })

  suite(".publicPath()", function () {
    test("no publications", function () {
      const filePath = new FullPath("content\\1.md")
      const publicPath = filePath.publicPath(new configuration.Publications())
      assert.equal(publicPath.value, "/content/1.md")
    })

    test("matching publication", function () {
      const publications = configuration.Publications.fromJSON([
        {
          localPath: "/content",
          publicExtension: "html",
          publicPath: "/",
        },
      ])
      const filePath = new FullPath("/content/1.md")
      const publicPath = filePath.publicPath(publications)
      assert.equal(publicPath.value, "/1.html")
    })
  })
})
