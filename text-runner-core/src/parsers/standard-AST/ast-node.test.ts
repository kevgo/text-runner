import { assert } from "chai"
import { AstNode } from "./ast-node"
import { AstNodeList } from "./ast-node-list"

test("AstNode.scaffold()", function () {
  const node = AstNode.scaffold({ type: "heading_open" })
  assert.equal(node.type, "heading_open")
})

test("AstNode.endTypeFor()", function () {
  const tests = {
    anchor_open: "anchor_close",
    heading_open: "heading_close",
  }
  for (const [give, want] of Object.entries(tests)) {
    const node = AstNode.scaffold({ type: give })
    const have = node.endType()
    assert.deepEqual(have, want)
  }
})

suite("AstNode.getNodesFor()", function () {
  test("flat list", function () {
    const list = new AstNodeList()
    list.push(AstNode.scaffold({ type: "text", line: 1 }))
    list.push(AstNode.scaffold({ type: "link_open", line: 2 }))
    list.push(AstNode.scaffold({ type: "text", line: 3 }))
    list.push(AstNode.scaffold({ type: "link_close", line: 4 }))
    list.push(AstNode.scaffold({ type: "text", line: 5 }))
    const nodes = list.getNodesFor(list[1])
    const lines = nodes.map(node => node.line)
    assert.deepEqual(lines, [2, 3, 4])
  })

  test("nested links in active regions", function () {
    const list = new AstNodeList()
    list.push(AstNode.scaffold({ type: "text", line: 1 }))
    list.push(AstNode.scaffold({ type: "link_open", line: 2 }))
    list.push(AstNode.scaffold({ type: "text", line: 3 }))
    list.push(AstNode.scaffold({ type: "anchor_open", line: 4 }))
    list.push(AstNode.scaffold({ type: "text", line: 5 }))
    list.push(AstNode.scaffold({ type: "anchor_close", line: 6 }))
    list.push(AstNode.scaffold({ type: "link_close", line: 7 }))
    list.push(AstNode.scaffold({ type: "text", line: 8 }))
    const nodes = list.getNodesFor(list[1])
    const lines = nodes.map(node => node.line)
    assert.deepEqual(lines, [2, 3, 4, 5, 6, 7])
  })
})

suite("AstNode.htmlLinkTarget()", function () {
  test("link tags", function () {
    const node = AstNode.scaffold({
      content: '<a href="http://foo.com">',
      type: "htmltag",
    })
    assert.equal(node.htmlLinkTarget(), "http://foo.com", "should return the href content of link tags")
  })

  test("non-link tags", function () {
    const node = AstNode.scaffold({ type: "htmltag", content: "hello" })
    assert.isNull(node.htmlLinkTarget())
  })

  test("anchor tags", function () {
    const node = AstNode.scaffold({
      content: '<a name="foo">',
      type: "htmltag",
    })
    assert.isNull(node.htmlLinkTarget())
  })
})
