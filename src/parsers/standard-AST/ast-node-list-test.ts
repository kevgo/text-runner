import { assert } from "chai"
import { UnprintedUserError } from "../../errors/unprinted-user-error"
import { AstNode } from "./ast-node"
import { AstNodeList } from "./ast-node-list"

describe("AstNodeList", function() {
  describe("concat", function() {
    it("adds the nodes in the given list", function() {
      const list1 = AstNodeList.scaffold({ type: "node1" })
      const list2 = AstNodeList.scaffold({ type: "node2" })
      const result = list1.concat(list2)
      assert.deepEqual(result.map(node => node.type), ["node1", "node2"])
    })
  })

  describe("getNodesFor", function() {
    it("returns the nodes until the given opening node is closed", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "paragraph_open" })
      list.pushNode({ type: "heading_open" })
      list.pushNode({ type: "text" })
      list.pushNode({ type: "heading_close" })
      list.pushNode({ type: "paragraph_close" })
      const result = list.getNodesFor(list[1])
      const types = result.map(node => node.type)
      assert.deepEqual(types, ["heading_open", "text", "heading_close"])
    })

    it("returns the given non-opening node", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "paragraph_open" })
      list.pushNode({ type: "strongtext", content: "foo" })
      list.pushNode({ type: "paragraph_close" })
      const result = list.getNodesFor(list[1])
      const types = result.map(node => node.type)
      assert.deepEqual(types, ["strongtext"])
    })
  })

  describe("getNodeOfTypes", function() {
    it("returns the node matching any of the given type", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "one" })
      list.pushNode({ type: "two" })
      list.pushNode({ type: "three" })
      const result = list.getNodeOfTypes("two", "four")
      assert.equal(result.type, "two")
    })

    it("throws for multiple matches", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "one" })
      list.pushNode({ type: "two" })
      assert.throws(() => list.getNodeOfTypes("one", "two"), UnprintedUserError)
    })

    it("throws for zero matches", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "one" })
      assert.throws(() => list.getNodeOfTypes("two"), UnprintedUserError)
    })
  })

  describe("getNodesOfTypes", function() {
    it("returns all nodes matching any of the given types", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "one" })
      list.pushNode({ type: "two" })
      list.pushNode({ type: "three" })
      const result = list.getNodesOfTypes("one", "three")
      assert.deepEqual(result.map(node => node.type), ["one", "three"])
    })
  })

  describe("textInNode", function() {
    it("returns the textual content until the given node is closed", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "paragraph_open" })
      list.pushNode({ type: "heading_open" })
      list.pushNode({ type: "text", content: "foo" })
      list.pushNode({ type: "text", content: "bar" })
      list.pushNode({ type: "heading_close" })
      list.pushNode({ type: "paragraph_close" })
      const result = list.textInNode(list[1])
      assert.equal(result, "foobar")
    })
  })

  describe("hasNodeOfType", function() {
    it("returns true if the list contains the given node type", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "paragraph_open" })
      list.pushNode({ type: "paragraph_close" })
      assert.isTrue(list.hasNodeOfType("paragraph"))
    })

    it("returns false if the list does not contain the given node type", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "paragraph_open" })
      list.pushNode({ type: "paragraph_close" })
      assert.isFalse(list.hasNodeOfType("code"))
    })
  })

  describe("iterator", function() {
    it("iterates the nodes", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "node1" })
      list.pushNode({ type: "node2" })
      const result = new AstNodeList()
      for (const node of list) {
        result.push(node)
      }
      assert.lengthOf(result, 2)
      assert.equal(result[0].type, "node1")
      assert.equal(result[1].type, "node2")
    })
  })

  describe("nodeTypes", function() {
    it("returns the node types in this list", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "type1" })
      list.pushNode({ type: "type2" })
      assert.deepEqual(list.nodeTypes(), ["type1", "type2"])
    })
  })

  describe("push", function() {
    it("adds the given node to the internal list", function() {
      const list = new AstNodeList()
      const node = AstNode.scaffold()
      list.push(node)
      assert.lengthOf(list, 1)
      assert.equal(list[0], node)
    })
  })

  describe("scaffold", function() {
    it("adds a new node with the given attributes", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "heading_open" })
      list.pushNode({ type: "text" })
      assert.lengthOf(list, 2)
      assert.equal(list[0].type, "heading_open")
      assert.equal(list[1].type, "text")
    })
  })

  describe("text", function() {
    it("returns all the textual content of the list", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      const result = list.text()
      assert.equal(result, "hello")
    })
  })

  describe("textInNodeOfType", function() {
    it("works with the type name", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      const result = list.textInNodeOfType("code")
      assert.equal(result, "hello")
    })

    it("works with the opening type name", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      const result = list.textInNodeOfType("code_open")
      assert.equal(result, "hello")
    })

    it("allows to provide multiple possible matching nodes", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      const result = list.textInNodeOfType("code", "fence")
      assert.equal(result, "hello")
    })

    it("throws if multiple matching nodes exist", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      list.pushNode({ type: "fence_open" })
      list.pushNode({ type: "text", content: "world" })
      list.pushNode({ type: "fence_close" })
      assert.throws(
        () => list.textInNodeOfType("code", "fence"),
        UnprintedUserError
      )
    })

    it("throws if no matching node exists", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      assert.throws(() => list.textInNodeOfType("fence"), UnprintedUserError)
    })
  })

  describe("textInNodesOfType", function() {
    it("returns the text of all matching nodes", function() {
      const list = new AstNodeList()
      list.pushNode({ type: "strongtext", content: "foo" })
      list.pushNode({ type: "strongtext", content: "bar" })
      const result = list.textInNodesOfType("strongtext")
      assert.deepEqual(result, ["foo", "bar"])
    })
  })
})
