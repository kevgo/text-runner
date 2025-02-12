import { assert } from "chai"

import { UserError } from "../errors/user-error.js"
import * as ast from "./index.js"

suite("ast.NodeList", function () {
  test(".concat()", function () {
    const list1 = ast.NodeList.scaffold({ type: "anchor_open" })
    const list2 = ast.NodeList.scaffold({ type: "bold_open" })
    const result = list1.concat(list2)
    assert.deepEqual(
      result.map(node => node.type),
      ["anchor_open", "bold_open"],
    )
  })

  suite(".getNodesFor()", function () {
    test("opening node given", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "paragraph_open" })
      list.pushNode({ type: "heading_open" })
      list.pushNode({ type: "text" })
      list.pushNode({ type: "heading_close" })
      list.pushNode({ type: "paragraph_close" })
      const result = list.nodesFor(list[1])
      const types = result.map(node => node.type)
      assert.deepEqual(
        types,
        ["heading_open", "text", "heading_close"],
        "should return the nodes until the given opening node is closed",
      )
    })

    test("non-opening node given", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "paragraph_open" })
      list.pushNode({ type: "text", content: "foo" })
      list.pushNode({ type: "paragraph_close" })
      const result = list.nodesFor(list[1])
      const types = result.map(node => node.type)
      assert.deepEqual(types, ["text"])
    })
  })

  suite(".nodeOfTypes()", function () {
    test("one match", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "anchor_open" })
      list.pushNode({ type: "bold_open" })
      list.pushNode({ type: "code_open" })
      const result = list.nodeOfTypes("bold_open", "fence_open")
      assert.equal(result.type, "bold_open")
    })

    test("multiple matches", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "anchor_open" })
      list.pushNode({ type: "bold_open" })
      assert.throws(() => list.nodeOfTypes("anchor_open", "bold_open"), UserError)
    })

    test("no matches", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "anchor_open" })
      assert.throws(() => list.nodeOfTypes("bold_open"), UserError)
    })
  })

  suite(".getNodesOfTypes()", function () {
    test("normal", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "anchor_open" })
      list.pushNode({ type: "bold_open" })
      list.pushNode({ type: "code_open" })
      const result = list.nodesOfTypes("anchor_open", "code_open")
      assert.deepEqual(
        result.map(node => node.type),
        ["anchor_open", "code_open"],
      )
    })
    test("opening nodes", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "anchor_open" })
      list.pushNode({ type: "text" })
      list.pushNode({ type: "anchor_close" })
      const result = list.nodesOfTypes("anchor_open")
      assert.deepEqual(
        result.map(node => node.type),
        ["anchor_open"],
      )
    })
  })

  test(".textInNode()", function () {
    const list = new ast.NodeList()
    list.pushNode({ type: "paragraph_open" })
    list.pushNode({ type: "heading_open" })
    list.pushNode({ type: "text", content: "foo" })
    list.pushNode({ type: "text", content: "bar" })
    list.pushNode({ type: "heading_close" })
    list.pushNode({ type: "paragraph_close" })
    const result = list.textInNode(list[1])
    assert.equal(result, "foobar")
  })

  suite(".hasNodeOfType()", function () {
    test("contains the given node type", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "paragraph_open" })
      list.pushNode({ type: "paragraph_close" })
      assert.isTrue(list.hasNodeOfType("paragraph"))
    })

    test("doesn't contain the given node type", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "paragraph_open" })
      list.pushNode({ type: "paragraph_close" })
      assert.isFalse(list.hasNodeOfType("code"))
    })
  })

  test(".iterator()", function () {
    const list = new ast.NodeList()
    list.pushNode({ type: "anchor_open" })
    list.pushNode({ type: "bold_open" })
    const result = new ast.NodeList()
    for (const node of list) {
      result.push(node)
    }
    assert.lengthOf(result, 2)
    assert.equal(result[0].type, "anchor_open")
    assert.equal(result[1].type, "bold_open")
  })

  test(".nodeTypes()", function () {
    const list = new ast.NodeList()
    list.pushNode({ type: "anchor_open" })
    list.pushNode({ type: "bold_open" })
    assert.deepEqual(list.nodeTypes(), ["anchor_open", "bold_open"])
  })

  test(".push()", function () {
    const list = new ast.NodeList()
    const node = ast.Node.scaffold()
    list.push(node)
    assert.lengthOf(list, 1)
    assert.equal(list[0], node)
  })

  test(".scaffold()", function () {
    const list = new ast.NodeList()
    list.pushNode({ type: "heading_open" })
    list.pushNode({ type: "text" })
    assert.lengthOf(list, 2)
    assert.equal(list[0].type, "heading_open")
    assert.equal(list[1].type, "text")
  })

  test(".text()", function () {
    const list = new ast.NodeList()
    list.pushNode({ type: "code_open" })
    list.pushNode({ type: "text", content: "hello" })
    list.pushNode({ type: "text", content: "world" })
    list.pushNode({ type: "code_close" })
    const result = list.text()
    assert.equal(result, "hello world")
  })

  suite(".textInNodeOfType()", function () {
    test("type name given", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })

      const result = list.textInNodeOfType("code")

      assert.equal(result, "hello")
    })

    test("opening type name given", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })

      const result = list.textInNodeOfType("code_open")

      assert.equal(result, "hello")
    })

    test("multiple possible type names given", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      const result = list.textInNodeOfType("code", "fence")
      assert.equal(result, "hello")
    })

    test("multiple matching nodes", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      list.pushNode({ type: "fence_open" })
      list.pushNode({ type: "text", content: "world" })
      list.pushNode({ type: "fence_close" })
      assert.throws(() => list.textInNodeOfType("code", "fence"), UserError)
    })

    test("no matching nodes", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      assert.throws(() => list.textInNodeOfType("fence"), UserError)
    })
  })

  suite(".textInNodeOfTypes()", function () {
    test("type name given", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      const result = list.textInNodeOfTypes("code", "fence")
      assert.equal(result, "hello")
    })

    test("opening type name given", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      const result = list.textInNodeOfTypes("code_open", "fence")
      assert.equal(result, "hello")
    })

    test("multiple matching nodes", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      list.pushNode({ type: "fence_open" })
      list.pushNode({ type: "text", content: "world" })
      list.pushNode({ type: "fence_close" })
      assert.throws(() => list.textInNodeOfTypes("code", "fence"), UserError)
    })

    test("no matching nodes", function () {
      const list = new ast.NodeList()
      list.pushNode({ type: "code_open" })
      list.pushNode({ type: "text", content: "hello" })
      list.pushNode({ type: "code_close" })
      assert.throws(() => list.textInNodeOfTypes("fence"), UserError)
    })
  })

  test(".textInNodesOfType()", function () {
    const list = new ast.NodeList()
    list.pushNode({ type: "text", content: "foo" })
    list.pushNode({ type: "text", content: "bar" })
    const texts = list.textInNodesOfType("text")
    assert.deepEqual(texts, ["foo", "bar"])
  })
})
