import { expect } from "chai"
import { AstNode } from "./ast-node"
import { AstNodeList } from "./ast-node-list"

describe("AstNode", function() {
  describe("scaffold", function() {
    it("returns a new node with the given attributes", function() {
      const node = AstNode.scaffold({ type: "heading_open" })
      expect(node.type).to.eql("heading_open")
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
        expect(node.endType()).to.eql(output)
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
      expect(lines).to.eql([2, 3, 4])
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
      expect(lines).to.eql([2, 3, 4, 5, 6, 7])
    })
  })

  describe("htmlLinkTarget", function() {
    it("returns the href content of link tags", function() {
      const node = AstNode.scaffold({
        content: '<a href="http://foo.com">',
        type: "htmltag"
      })
      expect(node.htmlLinkTarget()).to.equal("http://foo.com")
    })

    it("returns null for non-link tags", function() {
      const node = AstNode.scaffold({ type: "htmltag", content: "hello" })
      expect(node.htmlLinkTarget()).to.be.null
    })

    it("returns null for anchor tags", function() {
      const node = AstNode.scaffold({
        content: '<a name="foo">',
        type: "htmltag"
      })
      expect(node.htmlLinkTarget()).to.be.null
    })
  })
})
