import { assert } from "chai"
import { Publications } from "../configuration/publications/publications"
import { AbsoluteFilePath } from "./absolute-file-path"

test("AbsoluteFilePath.append()", function() {
  const filePath = new AbsoluteFilePath("/one")
  const appended = filePath.append("two")
  assert.equal(appended.unixified(), "one/two")
})

suite("AbsoluteFilePath.directory()", function() {
  const tests = [
    { desc: "Unix directory", give: "/foo/bar/", want: "foo/bar/" },
    { desc: "Unix file path", give: "/foo/bar/baz.md", want: "foo/bar/" },
    { desc: "Windows directory", give: "/foo/bar/", want: "foo/bar/" },
    { desc: "Windows file path", give: "\\foo\\bar\\baz.md", want: "foo/bar/" }
  ]
  for (const tt of tests) {
    test(tt.desc, function() {
      const file = new AbsoluteFilePath(tt.give)
      assert.equal(file.directory().unixified(), tt.want)
    })
  }
})

test("AbsoluteFilePath.extName()", function() {
  assert.equal(new AbsoluteFilePath("/one.md").extName(), ".md")
  assert.equal(new AbsoluteFilePath("/one").extName(), "")
})

suite("AbsoluteFilePath.isDirectory()", function() {
  const tests = [
    { desc: "Unix directory", give: "/foo/bar/", want: true },
    { desc: "Unix file path", give: "/foo/bar/baz.md", want: false },
    { desc: "Windows directory", give: "/foo/bar/", want: true },
    { desc: "Windows file path", give: "\\foo\\bar\\baz.md", want: false }
  ]
  for (const tt of tests) {
    test(tt.desc, function() {
      assert.equal(new AbsoluteFilePath(tt.give).isDirectory(), tt.want)
    })
  }
})

test("AbsoluteFilePath.unixified()", function() {
  assert.equal(new AbsoluteFilePath("/foo/bar").unixified(), "foo/bar")
  assert.equal(
    new AbsoluteFilePath("\\foo/bar\\baz").unixified(),
    "foo/bar/baz"
  )
})

suite("AbsoluteFilePath.publicPath()", function() {
  test("no publications", function() {
    const filePath = new AbsoluteFilePath("content\\1.md")
    const publicPath = filePath.publicPath(new Publications())
    assert.equal(publicPath.value, "/content/1.md")
  })

  test("matching publication", function() {
    const publications = Publications.fromJSON([
      {
        localPath: "/content",
        publicExtension: "html",
        publicPath: "/"
      }
    ])
    const filePath = new AbsoluteFilePath("/content/1.md")
    const publicPath = filePath.publicPath(publications)
    assert.equal(publicPath.value, "/1.html")
  })
})
