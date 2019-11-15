import { assert } from "chai"
import { Publications } from "../configuration/publications/publications"
import { AbsoluteFilePath } from "./absolute-file-path"

test("AbsoluteFilePath.append()", function() {
  const filePath = new AbsoluteFilePath("/one")
  const appended = filePath.append("two")
  assert.equal(appended.unixified(), "one/two")
})

suite("AbsoluteFilePath.directory()", function() {
  const tests = {
    "Unix directory": ["/foo/bar/", "foo/bar/"],
    "Unix file path": ["/foo/bar/baz.md", "foo/bar/"],
    "Windows directory": ["/foo/bar/", "foo/bar/"],
    "Windows file path": ["\\foo\\bar\\baz.md", "foo/bar/"]
  }
  for (const [name, data] of Object.entries(tests)) {
    test(name, function() {
      const [input, output] = data
      const file = new AbsoluteFilePath(input)
      assert.equal(file.directory().unixified(), output)
    })
  }
})

suite("AbsoluteFilePath.extName()", function() {
  test("with extension", function() {
    const filePath = new AbsoluteFilePath("/one.md")
    assert.equal(filePath.extName(), ".md")
  })

  test("no file extension", function() {
    const filePath = new AbsoluteFilePath("/one")
    assert.equal(filePath.extName(), "")
  })
})

suite("AbsoluteFilePath.isDirectory()", function() {
  const tests = {
    "Unix directory": ["/foo/bar/", true],
    "Unix file path": ["/foo/bar/baz.md", false],
    "Windows directory": ["/foo/bar/", true],
    "Windows file path": ["\\foo\\bar\\baz.md", false]
  }
  for (const [name, data] of Object.entries(tests)) {
    test(name, function() {
      const [input, output] = data
      const file = new AbsoluteFilePath(input as string)
      assert.equal(file.isDirectory(), output)
    })
  }
})

suite("AbsoluteFilePath.unixified()", function() {
  const tests = {
    "/foo/bar": "foo/bar",
    "\\foo/bar\\baz": "foo/bar/baz"
  }
  for (const [input, output] of Object.entries(tests)) {
    test(`converts ${input} to ${output}`, function() {
      const filePath = new AbsoluteFilePath(input)
      assert.equal(filePath.unixified(), output)
    })
  }
})

suite("AbsoluteFilePath.publicPath()", function() {
  test("no publications", function() {
    const filePath = new AbsoluteFilePath("content\\1.md")
    const actual = filePath.publicPath(new Publications())
    assert.equal(actual.value, "/content/1.md")
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
    const actual = filePath.publicPath(publications)
    assert.equal(actual.value, "/1.html")
  })
})
