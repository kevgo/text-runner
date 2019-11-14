import { assert } from "chai"
import { AstNode } from "./ast-node"
import { AstNodeList } from "./ast-node-list"

describe("AstNode", function() {
  describe("scaffold", function() {
    it("returns a new node with the given attributes", function() {
      const node = AstNode.scaffold({ type: "heading_open" })
      assert.equal(node.type, "heading_open")
    })
  })

  describe("endTypeFor", function() {
    it("returns the closing tag", function() {
      const data = {
        anchor_open: "anchor_close",
        heading_open: "heading_close"
      }
      for (const [input, output] of Object.entries(data)) {
        if (!data.hasOwnProperty(input)) {
          continue
        }
        const node = AstNode.scaffold({ type: input })
        assert.deepEqual(node.endType(), output)
      }
    })
  })

  describe("getNodesFor", function() {
    it("returns the nodes contained in the given AstNode", function() {
      const list = new AstNodeList()
      list.push(AstNode.scaffold({ type: "text", line: 1 }))
      list.push(AstNode.scaffold({ type: "link_open", line: 2 }))
      list.push(AstNode.scaffold({ type: "text", line: 3 }))
      list.push(AstNode.scaffold({ type: "link_close", line: 4 }))
      list.push(AstNode.scaffold({ type: "text", line: 5 }))
      const actual = list.getNodesFor(list[1])
      const lines = actual.map(node => node.line)
      assert.deepEqual(lines, [2, 3, 4])
    })

    it("handles nested links in active regions", function() {
      const list = new AstNodeList()
      list.push(AstNode.scaffold({ type: "text", line: 1 }))
      list.push(AstNode.scaffold({ type: "link_open", line: 2 }))
      list.push(AstNode.scaffold({ type: "text", line: 3 }))
      list.push(AstNode.scaffold({ type: "anchor_open", line: 4 }))
      list.push(AstNode.scaffold({ type: "text", line: 5 }))
      list.push(AstNode.scaffold({ type: "anchor_close", line: 6 }))
      list.push(AstNode.scaffold({ type: "link_close", line: 7 }))
      list.push(AstNode.scaffold({ type: "text", line: 8 }))
      const actual = list.getNodesFor(list[1])
      const lines = actual.map(node => node.line)
      assert.deepEqual(lines, [2, 3, 4, 5, 6, 7])
    })
  })

  describe("htmlLinkTarget", function() {
    it("returns the href content of link tags", function() {
      const node = AstNode.scaffold({
        content: '<a href="http://foo.com">',
        type: "htmltag"
      })
      assert.equal(node.htmlLinkTarget(), "http://foo.com")
    })

    it("returns null for non-link tags", function() {
      const node = AstNode.scaffold({ type: "htmltag", content: "hello" })
      assert.isNull(node.htmlLinkTarget())
    })

    it("returns null for anchor tags", function() {
      const node = AstNode.scaffold({
        content: '<a name="foo">',
        type: "htmltag"
      })
      assert.isNull(node.htmlLinkTarget())
    })
  })
})
