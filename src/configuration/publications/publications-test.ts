import { assert } from "chai"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { Publications } from "./publications"

suite("Publications.forFilePath()", function() {
  test("a publication matches the given filePath", function() {
    const publications = Publications.fromJSON([
      {
        localPath: "foo",
        publicExtension: "",
        publicPath: ""
      },
      {
        localPath: "bar",
        publicExtension: "",
        publicPath: ""
      }
    ])
    const filePath = new AbsoluteFilePath("bar")

    const actual = publications.forFilePath(filePath)

    assert.isDefined(actual)
    // @ts-ignore: actual is not null here
    assert.equal(actual.localPath, "/bar/")
  })

  test("no publication matches", function() {
    const publications = Publications.fromJSON([
      {
        localPath: "foo",
        publicExtension: "",
        publicPath: ""
      }
    ])
    const filePath = new AbsoluteFilePath("bar")

    const actual = publications.forFilePath(filePath)

    assert.isUndefined(actual)
  })
})

suite("Publications.sortPathMappings()", function() {
  test("has publications", function() {
    const original = Publications.fromJSON([
      {
        localPath: "/content/",
        publicExtension: "",
        publicPath: "/"
      },
      {
        localPath: "/content/posts",
        publicExtension: "html",
        publicPath: "/blog"
      }
    ])
    const actual = original.sorted()
    const expected = Publications.fromJSON([
      {
        localPath: "/content/posts",
        publicExtension: "html",
        publicPath: "/blog"
      },
      {
        localPath: "/content/",
        publicExtension: "",
        publicPath: "/"
      }
    ])
    assert.deepEqual(actual, expected)
  })

  test("no publications", function() {
    assert.lengthOf(new Publications().sort(), 0)
  })
})
