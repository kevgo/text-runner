import { assert } from "chai"

import * as ast from "./index.js"

suite("ast.Node", function () {
  test(".scaffold()", function () {
    const node = ast.Node.scaffold({ type: "heading_open" })
    assert.equal(node.type, "heading_open")
  })

  test(".endTypeFor()", function () {
    const tests: { [key in ast.NodeType]?: ast.NodeType } = {
      anchor_open: "anchor_close",
      heading_open: "heading_close",
    }
    for (const [give, want] of Object.entries(tests)) {
      const node = ast.Node.scaffold({ type: give as ast.NodeType })
      const have = node.endType()
      assert.deepEqual(have, want)
    }
  })

  suite(".getNodesFor()", function () {
    test("flat list", function () {
      const list = new ast.NodeList()
      list.push(ast.Node.scaffold({ type: "text", line: 1 }))
      list.push(ast.Node.scaffold({ type: "link_open", line: 2 }))
      list.push(ast.Node.scaffold({ type: "text", line: 3 }))
      list.push(ast.Node.scaffold({ type: "link_close", line: 4 }))
      list.push(ast.Node.scaffold({ type: "text", line: 5 }))
      const nodes = list.nodesFor(list[1])
      const lines = nodes.map(node => node.location.line)
      assert.deepEqual(lines, [2, 3, 4])
    })

    test("nested links in active regions", function () {
      const list = new ast.NodeList()
      list.push(ast.Node.scaffold({ type: "text", line: 1 }))
      list.push(ast.Node.scaffold({ type: "link_open", line: 2 }))
      list.push(ast.Node.scaffold({ type: "text", line: 3 }))
      list.push(ast.Node.scaffold({ type: "anchor_open", line: 4 }))
      list.push(ast.Node.scaffold({ type: "text", line: 5 }))
      list.push(ast.Node.scaffold({ type: "anchor_close", line: 6 }))
      list.push(ast.Node.scaffold({ type: "link_close", line: 7 }))
      list.push(ast.Node.scaffold({ type: "text", line: 8 }))
      const nodes = list.nodesFor(list[1])
      const lines = nodes.map(node => node.location.line)
      assert.deepEqual(lines, [2, 3, 4, 5, 6, 7])
    })
  })

  suite(".htmlLinkTarget()", function () {
    test("link tags", function () {
      const node = ast.Node.scaffold({
        content: '<a href="http://foo.com">',
        type: "htmltag",
      })
      assert.equal(node.htmlLinkTarget(), "http://foo.com", "should return the href content of link tags")
    })

    test("non-link tags", function () {
      const node = ast.Node.scaffold({ type: "htmltag", content: "hello" })
      assert.isNull(node.htmlLinkTarget())
    })

    test("anchor tags", function () {
      const node = ast.Node.scaffold({
        content: '<a name="foo">',
        type: "htmltag",
      })
      assert.isNull(node.htmlLinkTarget())
    })
  })
})
