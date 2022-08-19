import { assert } from "chai"

import * as files from "../filesystem/full-path.js"
import { Publications } from "./publications.js"

suite("Publications.forFilePath()", function () {
  test("a publication matches the given filePath", function () {
    const publications = Publications.fromConfigs([
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
    const filePath = new files.FullPath("bar")

    const publication = publications.forFilePath(filePath)

    assert.isDefined(publication)
    // @ts-ignore: publication is not null here
    assert.equal(publication.localPath, "/bar/")
  })

  test("no publication matches", function () {
    const publications = Publications.fromConfigs([
      {
        localPath: "foo",
        publicExtension: "",
        publicPath: "",
      },
    ])
    const filePath = new files.FullPath("bar")

    const publication = publications.forFilePath(filePath)

    assert.isUndefined(publication)
  })
})

suite("Publications.sortPathMappings()", function () {
  test("has publications", function () {
    const original = Publications.fromConfigs([
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
    const expected = Publications.fromConfigs([
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
