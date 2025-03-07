import { assert } from "chai"
import { suite, test } from "node:test"

import * as configuration from "../configuration/index.js"
import { files } from "../text-runner.js"
import { FullPath } from "./full-path.js"

suite("FullPath", () => {
  test(".append()", () => {
    const filePath = new FullPath("/one")
    const appended = filePath.append("two")
    assert.equal(appended.unixified(), "one/two")
  })

  suite(".directory()", () => {
    const tests = [
      { desc: "Unix directory", give: "/foo/bar/", want: "foo/bar/" },
      { desc: "Unix file path", give: "/foo/bar/baz.md", want: "foo/bar/" },
      { desc: "Windows directory", give: "/foo/bar/", want: "foo/bar/" },
      { desc: "Windows file path", give: "\\foo\\bar\\baz.md", want: "foo/bar/" }
    ]
    for (const tt of tests) {
      test(tt.desc, () => {
        const file = new FullPath(tt.give)
        assert.equal(file.directory().unixified(), tt.want)
      })
    }
  })

  test(".extName()", () => {
    assert.equal(new FullPath("/one.md").extName(), ".md")
    assert.equal(new FullPath("/one").extName(), "")
  })

  suite(".isDirectory()", () => {
    const tests = [
      { desc: "Unix directory", give: "/foo/bar/", want: true },
      { desc: "Unix file path", give: "/foo/bar/baz.md", want: false },
      { desc: "Windows directory", give: "/foo/bar/", want: true },
      { desc: "Windows file path", give: "\\foo\\bar\\baz.md", want: false }
    ]
    for (const tt of tests) {
      test(tt.desc, () => {
        assert.equal(new FullPath(tt.give).isDirectory(), tt.want)
      })
    }
  })

  test(".joinStr()", () => {
    const fullPath = new files.FullPath("/one/two")
    const have = fullPath.joinStr("three")
    const want = "one/two/three"
    assert.deepEqual(have, want)
  })

  test(".unixified()", () => {
    assert.equal(new FullPath("/foo/bar").unixified(), "foo/bar")
    assert.equal(new FullPath("\\foo/bar\\baz").unixified(), "foo/bar/baz")
  })

  suite(".publicPath()", () => {
    test("no publications", () => {
      const filePath = new FullPath("content\\1.md")
      const publicPath = filePath.publicPath(new configuration.Publications())
      assert.equal(publicPath.value, "/content/1.md")
    })

    test("matching publication", () => {
      const publications = configuration.Publications.fromConfigs([
        {
          localPath: "/content",
          publicExtension: "html",
          publicPath: "/"
        }
      ])
      const filePath = new FullPath("/content/1.md")
      const publicPath = filePath.publicPath(publications)
      assert.equal(publicPath.value, "/1.html")
    })
  })
})
