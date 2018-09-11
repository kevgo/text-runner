import { expect } from "chai"
import { describe, it } from "mocha"
import AbsoluteFilePath from "../domain-model/absolute-file-path.js"
import Publications from "./publications.js"

describe("Publications", function() {
  describe("forFilePath", function() {
    it("returns the publication that publishes the given FilePath", function() {
      const publications = Publications.fromJSON([
        {
          localPath: "foo",
          publicPath: "",
          publicExtension: ""
        },
        {
          localPath: "bar",
          publicPath: "",
          publicExtension: ""
        }
      ])
      const filePath = new AbsoluteFilePath("bar")
      const actual: any = publications.forFilePath(filePath) || {}
      expect(actual.localPath).to.equal("/bar/")
    })

    it("returns NULL if no publication matches", function() {
      const publications = Publications.fromJSON([
        {
          localPath: "foo",
          publicPath: "",
          publicExtension: ""
        }
      ])
      const filePath = new AbsoluteFilePath("bar")
      const actual = publications.forFilePath(filePath)
      expect(actual).to.undefined
    })
  })

  describe("sortPathMappings", function() {
    it("returns the given publications sorted descending by publicPath", function() {
      const original = Publications.fromJSON([
        {
          localPath: "/content/",
          publicPath: "/",
          publicExtension: ""
        },
        {
          localPath: "/content/posts",
          publicPath: "/blog",
          publicExtension: "html"
        }
      ])
      const actual = original.sorted()
      const expected = Publications.fromJSON([
        {
          localPath: "/content/posts",
          publicPath: "/blog",
          publicExtension: "html"
        },
        {
          localPath: "/content/",
          publicPath: "/",
          publicExtension: ""
        }
      ])
      expect(actual).to.eql(expected)
    })

    it("works with empty mappings", function() {
      const publications = new Publications()
      expect(publications.sort()).to.eql([])
    })
  })
})
