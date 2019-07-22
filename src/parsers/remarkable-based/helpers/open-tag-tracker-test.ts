import { expect } from "chai"
import { AbsoluteFilePath } from "../../../finding-files/absolute-file-path"
import { AstNode } from "../../standard-AST/ast-node"
import { OpenTagTracker } from "./open-tag-tracker"

describe("OpenTagTracker", function() {
  describe("add", function() {
    it("allows adding new tag types", function() {
      const openTags = new OpenTagTracker()
      openTags.add(AstNode.scaffold())
    })

    it("does not allow to add existing tag types", function() {
      const openTags = new OpenTagTracker()
      const add = function() {
        openTags.add(AstNode.scaffold({ type: "foo" }))
      }
      expect(add).to.throw
    })
  })

  describe("peek", function() {
    it("returns the latest open tag", function() {
      const openTags = new OpenTagTracker()
      const node1 = AstNode.scaffold({ type: "foo", line: 3 })
      openTags.add(node1)
      const node2 = AstNode.scaffold({ type: "bar", line: 3 })
      openTags.add(node2)
      const result = openTags.peek()
      expect(result).to.equal(node2)
    })
  })

  describe("popType", function() {
    it("returns the given open tag from the end", function() {
      const openTags = new OpenTagTracker()
      const node = AstNode.scaffold({ type: "foo", line: 3 })
      openTags.add(node)
      const result = openTags.popType("foo", new AbsoluteFilePath(""), 0)
      expect(result).to.equal(node)
    })

    it("returns the given open tag from close to the end", function() {
      const openTags = new OpenTagTracker()
      const node1 = AstNode.scaffold({ type: "foo", line: 3 })
      openTags.add(node1)
      const node2 = AstNode.scaffold({ type: "bar", line: 3 })
      openTags.add(node2)
      const result = openTags.popType("foo", new AbsoluteFilePath(""), 0)
      expect(result).to.equal(node1)
      expect(openTags.nodes).to.have.length(1)
      const types = openTags.nodes.map(node => node.type)
      expect(types).to.eql(["bar"])
    })

    it("throws if the tag is not the expected type", function() {
      const openTags = new OpenTagTracker()
      const node = AstNode.scaffold({ type: "foo", line: 3 })
      openTags.add(node)
      expect(() =>
        openTags.popType("other", new AbsoluteFilePath(""), 0)
      ).to.throw(Error)
    })
  })
})
