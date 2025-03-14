import { assert } from "chai"
import { suite, test } from "node:test"

import * as ast from "../ast/index.js"
import * as files from "../filesystem/index.js"
import * as linkTarget from "./index.js"

suite("linkTarget.List.addNodeList()", () => {
  test("node list with anchors", () => {
    const nodeList = ast.NodeList.scaffold({
      attributes: { name: "foo bar" },
      file: "file.md",
      type: "anchor_open"
    })
    const targetList = new linkTarget.List()
    targetList.addNodeList(nodeList)
    assert.isTrue(targetList.hasAnchor(new files.FullFilePath("file.md"), "foo-bar"))
  })

  test("node list without link targets", () => {
    const nodeList = ast.NodeList.scaffold({ file: "file.md", type: "text" })
    const targetList = new linkTarget.List()
    targetList.addNodeList(nodeList)
    assert.isTrue(targetList.hasFile(new files.FullFilePath("file.md")), "should register files without link targets")
  })

  test("node list with headings", () => {
    const nodeList = new ast.NodeList()
    nodeList.pushNode({
      attributes: {},
      file: "file.md",
      type: "h1_open"
    })
    nodeList.pushNode({
      content: "Get Started in 5 Minutes",
      file: "file.md",
      type: "text"
    })
    nodeList.pushNode({
      file: "file.md",
      type: "h1_close"
    })
    const targetList = new linkTarget.List()
    targetList.addNodeList(nodeList)
    assert.isTrue(targetList.hasAnchor(new files.FullFilePath("file.md"), "get-started-in-5-minutes"))
  })
})

suite("linkTarget.List.anchorType()", () => {
  test("headings", () => {
    const nodeList = new ast.NodeList()
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
    const list = new linkTarget.List()
    list.addHeading(nodeList[0], nodeList)
    const filePath = new files.FullFilePath("file.md")
    assert.equal(list.anchorType(filePath, "foo-bar"), "heading")
  })

  test("anchors", () => {
    const list = new linkTarget.List()
    const filePath = new files.FullFilePath("foo.md")
    list.addLinkTarget(filePath, "anchor", "hello")
  })
})

suite("linkTarget.List.getAnchor()", () => {
  test("target exists", () => {
    const list = new linkTarget.List()
    const filePath = new files.FullFilePath("foo.md")
    list.addLinkTarget(filePath, "heading", "hello")
    const have = list.getAnchor(filePath, "hello")
    const want: linkTarget.Target = { name: "hello", type: "heading" }
    assert.deepEqual(have, want)
  })
  test("target does not exist", () => {
    const list = new linkTarget.List()
    const filePath = new files.FullFilePath("foo.md")
    assert.isNull(list.getAnchor(filePath, "zonk"))
  })
})

suite(".getAnchors()", () => {
  test("file has anchors", () => {
    const list = new linkTarget.List()
    const filePath = new files.FullFilePath("foo.md")
    list.addLinkTarget(filePath, "heading", "hello")
    list.addLinkTarget(filePath, "heading", "world")
    const have = list.getAnchors(filePath)
    const want = ["hello", "world"]
    assert.deepEqual(have, want)
  })
})

test("linkTarget.List.hasAnchor()", () => {
  const list = new linkTarget.List()
  const filePath = new files.FullFilePath("foo.md")
  list.addLinkTarget(filePath, "heading", "hello")
  assert.isTrue(list.hasAnchor(filePath, "hello"))
  assert.isFalse(list.hasAnchor(filePath, "zonk"))
})

suite("linkTarget.List.hasFile()", () => {
  test("contains file with anchors", () => {
    const list = new linkTarget.List()
    const filePath = new files.FullFilePath("foo.md")
    list.addLinkTarget(filePath, "heading", "hello")
    assert.isTrue(list.hasFile(filePath))
  })

  test("contains the file without anchors", () => {
    const nodeList = ast.NodeList.scaffold({ file: "file.md", type: "text" })
    const targetList = new linkTarget.List()
    targetList.addNodeList(nodeList)
    assert.isTrue(targetList.hasFile(new files.FullFilePath("file.md")))
  })

  test("doesn't contain the file", () => {
    const list = new linkTarget.List()
    const filePath = new files.FullFilePath("foo.md")
    assert.isFalse(list.hasFile(filePath))
  })
})
