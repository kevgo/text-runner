import { assert } from "chai"

import { AbsoluteFilePath } from "../filesystem/absolute-file-path"
import { Publications } from "./publications"

suite("Publications.forFilePath()", function () {
  test("a publication matches the given filePath", function () {
    const publications = Publications.fromJSON([
      {
        localPath: "foo",
        publicExtension: "",
        publicPath: "",
      },
      {
        localPath: "bar",
        publicExtension: "",
        publicPath: "",
      },
    ])
    const filePath = new AbsoluteFilePath("bar")

    const publication = publications.forFilePath(filePath)

    assert.isDefined(publication)
    // @ts-ignore: publication is not null here
    assert.equal(publication.localPath, "/bar/")
  })

  test("no publication matches", function () {
    const publications = Publications.fromJSON([
      {
        localPath: "foo",
        publicExtension: "",
        publicPath: "",
      },
    ])
    const filePath = new AbsoluteFilePath("bar")

    const publication = publications.forFilePath(filePath)

    assert.isUndefined(publication)
  })
})

suite("Publications.sortPathMappings()", function () {
  test("has publications", function () {
    const original = Publications.fromJSON([
      {
        localPath: "/content/",
        publicExtension: "",
        publicPath: "/",
      },
      {
        localPath: "/content/posts",
        publicExtension: "html",
        publicPath: "/blog",
      },
    ])
    const publication = original.sorted()
    const expected = Publications.fromJSON([
      {
        localPath: "/content/posts",
        publicExtension: "html",
        publicPath: "/blog",
      },
      {
        localPath: "/content/",
        publicExtension: "",
        publicPath: "/",
      },
    ])
    assert.deepEqual(publication, expected)
  })

  test("no publications", function () {
    assert.lengthOf(new Publications().sort(), 0)
  })
})
