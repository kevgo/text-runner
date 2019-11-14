import { assert } from "chai"
import { AbsoluteFilePath } from "../filesystem/absolute-file-path"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { LinkTargetList } from "./link-target-list"

describe("LinkTargetList", function() {
  describe("addNodeList", function() {
    it("adds the anchors in the given AstNodeList", function() {
      const nodeList = AstNodeList.scaffold({
        attributes: { name: "foo bar" },
        file: "file.md",
        type: "anchor_open"
      })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      const actual = targetList.hasAnchor(
        new AbsoluteFilePath("file.md"),
        "foo-bar"
      )
      assert.isTrue(actual)
    })

    it("registers files even if they do not contain link targets", function() {
      const nodeList = AstNodeList.scaffold({ file: "file.md", type: "text" })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      assert.isTrue(targetList.hasFile(new AbsoluteFilePath("file.md")))
    })

    it("adds the headings in the given AstNodeList", function() {
      const nodeList = new AstNodeList()
      nodeList.pushNode({
        attributes: {},
        file: "file.md",
        type: "h1_open"
      })
      nodeList.pushNode({
        content: "foo bar",
        file: "file.md",
        type: "text"
      })
      nodeList.pushNode({
        file: "file.md",
        type: "h1_close"
      })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      const filePath = new AbsoluteFilePath("file.md")
      assert.isTrue(targetList.hasAnchor(filePath, "foo-bar"))
    })
  })

  describe("anchorType", function() {
    it('returns "heading" for headings', function() {
      const nodeList = new AstNodeList()
      nodeList.pushNode({
        attributes: {},
        file: "file.md",
        type: "heading_open"
      })
      nodeList.pushNode({
        content: "foo bar",
        file: "file.md",
        type: "text"
      })
      nodeList.pushNode({
        file: "file.md",
        type: "heading_close"
      })
      const list = new LinkTargetList()
      list.addHeading(nodeList[0], nodeList)
      const filePath = new AbsoluteFilePath("file.md")
      assert.equal(list.anchorType(filePath, "foo-bar"), "heading")
    })
    it('returns "anchor" for HTML anchors', function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath("foo.md")
      list.addLinkTarget(filePath, "anchor", "hello")
      assert.equal(list.anchorType(filePath, "hello"), "anchor")
    })
  })

  describe("hasAnchor", function() {
    it("returns TRUE if the given anchor exists", function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath("foo.md")
      list.addLinkTarget(filePath, "heading", "hello")
      assert.isTrue(list.hasAnchor(filePath, "hello"))
    })
    it("returns FALSE if the given anchor does not exist in the file", function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath("foo.md")
      list.addLinkTarget(filePath, "heading", "hello")
      assert.isFalse(list.hasAnchor(filePath, "zonk"))
    })
    it("returns FALSE if the given file does not exist", function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath("zonk.md")
      assert.isFalse(list.hasAnchor(filePath, "foo"))
    })
  })

  describe("hasFile", function() {
    it("returns TRUE if the list contains the file with anchors", function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath("foo.md")
      list.addLinkTarget(filePath, "heading", "hello")
      assert.isTrue(list.hasFile(filePath))
    })
    it("returns TRUE if the list contains the file without anchors", function() {
      const nodeList = AstNodeList.scaffold({ file: "file.md", type: "text" })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      assert.isTrue(targetList.hasFile(new AbsoluteFilePath("file.md")))
    })
    it("returns FALSE if the list does not contain the file", function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath("foo.md")
      assert.isFalse(list.hasFile(filePath))
    })
  })
})
