import { assert } from "chai"
import { suite, test } from "node:test"

import * as ast from "./index.js"

suite("ast.Node", function() {
  test(".scaffold()", function() {
    const node = ast.Node.scaffold({ type: "heading_open" })
    assert.equal(node.type, "heading_open")
  })

  test(".endTypeFor()", function() {
    const tests: { [key in ast.NodeType]?: ast.NodeType } = {
      anchor_open: "anchor_close",
      heading_open: "heading_close"
    }
    for (const [give, want] of Object.entries(tests)) {
      const node = ast.Node.scaffold({ type: give as ast.NodeType })
      const have = node.endType()
      assert.deepEqual(have, want)
    }
  })

  suite(".getNodesFor()", function() {
    test("flat list", function() {
      const list = new ast.NodeList()
      list.push(ast.Node.scaffold({ line: 1, type: "text" }))
      list.push(ast.Node.scaffold({ line: 2, type: "link_open" }))
      list.push(ast.Node.scaffold({ line: 3, type: "text" }))
      list.push(ast.Node.scaffold({ line: 4, type: "link_close" }))
      list.push(ast.Node.scaffold({ line: 5, type: "text" }))
      const nodes = list.nodesFor(list[1])
      const lines = nodes.map(node => node.location.line)
      assert.deepEqual(lines, [2, 3, 4])
    })

    test("nested links in active regions", function() {
      const list = new ast.NodeList()
      list.push(ast.Node.scaffold({ line: 1, type: "text" }))
      list.push(ast.Node.scaffold({ line: 2, type: "link_open" }))
      list.push(ast.Node.scaffold({ line: 3, type: "text" }))
      list.push(ast.Node.scaffold({ line: 4, type: "anchor_open" }))
      list.push(ast.Node.scaffold({ line: 5, type: "text" }))
      list.push(ast.Node.scaffold({ line: 6, type: "anchor_close" }))
      list.push(ast.Node.scaffold({ line: 7, type: "link_close" }))
      list.push(ast.Node.scaffold({ line: 8, type: "text" }))
      const nodes = list.nodesFor(list[1])
      const lines = nodes.map(node => node.location.line)
      assert.deepEqual(lines, [2, 3, 4, 5, 6, 7])
    })
  })

  suite(".htmlLinkTarget()", function() {
    test("link tags", function() {
      const node = ast.Node.scaffold({
        content: "<a href=\"http://foo.com\">",
        type: "htmltag"
      })
      assert.equal(node.htmlLinkTarget(), "http://foo.com", "should return the href content of link tags")
    })

    test("non-link tags", function() {
      const node = ast.Node.scaffold({ content: "hello", type: "htmltag" })
      assert.isNull(node.htmlLinkTarget())
    })

    test("anchor tags", function() {
      const node = ast.Node.scaffold({
        content: "<a name=\"foo\">",
        type: "htmltag"
      })
      assert.isNull(node.htmlLinkTarget())
    })
  })
})
