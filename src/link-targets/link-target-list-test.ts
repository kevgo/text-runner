import { assert } from "chai"
import { AbsoluteFilePath } from "../filesystem/absolute-file-path"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { LinkTargetList } from "./link-target-list"

suite("LinkTargetList.addNodeList()", function() {
  test("node list with anchors", function() {
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

  test("node list without link targets", function() {
    const nodeList = AstNodeList.scaffold({ file: "file.md", type: "text" })
    const targetList = new LinkTargetList()
    targetList.addNodeList(nodeList)
    assert.isTrue(
      targetList.hasFile(new AbsoluteFilePath("file.md")),
      "should register files without link targets"
    )
  })

  test("node list with headings", function() {
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

suite("LinkTargetList.anchorType()", function() {
  test("headings", function() {
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

  test("anchors", function() {
    const list = new LinkTargetList()
    const filePath = new AbsoluteFilePath("foo.md")
    list.addLinkTarget(filePath, "anchor", "hello")
    assert.equal(list.anchorType(filePath, "hello"), "anchor")
  })
})

suite("LinkTargetList.hasAnchor()", function() {
  const tests = [
    { anchor: "hello", give: "hello", want: true },
    { anchor: "hello", give: "zonk", want: false }
  ]
  for (const tt of tests) {
    test(tt.give, function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath("foo.md")
      list.addLinkTarget(filePath, "heading", tt.anchor)
      assert.equal(list.hasAnchor(filePath, tt.give), tt.want)
    })
  }
})

suite("LinkTargetList.hasFile()", function() {
  test("contains file with anchors", function() {
    const list = new LinkTargetList()
    const filePath = new AbsoluteFilePath("foo.md")
    list.addLinkTarget(filePath, "heading", "hello")
    assert.isTrue(list.hasFile(filePath))
  })

  test("contains the file without anchors", function() {
    const nodeList = AstNodeList.scaffold({ file: "file.md", type: "text" })
    const targetList = new LinkTargetList()
    targetList.addNodeList(nodeList)
    assert.isTrue(targetList.hasFile(new AbsoluteFilePath("file.md")))
  })

  test("doesn't contain the file", function() {
    const list = new LinkTargetList()
    const filePath = new AbsoluteFilePath("foo.md")
    assert.isFalse(list.hasFile(filePath))
  })
})
