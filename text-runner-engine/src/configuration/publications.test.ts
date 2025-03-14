import { assert } from "chai"
import { suite, test } from "node:test"

import * as files from "../filesystem/full-path.js"
import { Publications } from "./publications.js"

suite("Publications.forFilePath()", () => {
  test("a publication matches the given filePath", () => {
    const publications = Publications.fromConfigs([
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
    const filePath = new files.FullPath("bar")
    const publication = publications.forFilePath(filePath)
    if (publication == null) {
      throw "publication is null"
    }
    assert.equal(publication.localPath, "/bar/")
  })

  test("no publication matches", () => {
    const publications = Publications.fromConfigs([
      {
        localPath: "foo",
        publicExtension: "",
        publicPath: ""
      }
    ])
    const filePath = new files.FullPath("bar")

    const publication = publications.forFilePath(filePath)

    assert.isUndefined(publication)
  })
})

suite("Publications.sortPathMappings()", () => {
  test("has publications", () => {
    const original = Publications.fromConfigs([
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
    const publication = original.sorted()
    const expected = Publications.fromConfigs([
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
    assert.deepEqual(publication, expected)
  })

  test("no publications", () => {
    assert.lengthOf(new Publications().sort(), 0)
  })
})
