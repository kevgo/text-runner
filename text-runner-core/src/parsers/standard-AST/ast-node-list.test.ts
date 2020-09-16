import { assert } from "chai"
import { UserError } from "../../errors/user-error"
import { AstNode } from "./ast-node"
import { AstNodeList } from "./ast-node-list"

test("AstNodeList.concat()", function () {
  const list1 = AstNodeList.scaffold({ type: "node1" })
  const list2 = AstNodeList.scaffold({ type: "node2" })
  const result = list1.concat(list2)
  assert.deepEqual(
    result.map((node) => node.type),
    ["node1", "node2"]
  )
})

suite("AstNodeList.getNodesFor()", function () {
  test("opening node given", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "paragraph_open" })
    list.pushNode({ type: "heading_open" })
    list.pushNode({ type: "text" })
    list.pushNode({ type: "heading_close" })
    list.pushNode({ type: "paragraph_close" })
    const result = list.getNodesFor(list[1])
    const types = result.map((node) => node.type)
    assert.deepEqual(
      types,
      ["heading_open", "text", "heading_close"],
      "should return the nodes until the given opening node is closed"
    )
  })

  test("non-opening node given", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "paragraph_open" })
    list.pushNode({ type: "strongtext", content: "foo" })
    list.pushNode({ type: "paragraph_close" })
    const result = list.getNodesFor(list[1])
    const types = result.map((node) => node.type)
    assert.deepEqual(types, ["strongtext"])
  })
})

suite("AstNodeList.getNodeOfTypes()", function () {
  test("one match", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "one" })
    list.pushNode({ type: "two" })
    list.pushNode({ type: "three" })
    const result = list.getNodeOfTypes("two", "four")
    assert.equal(result.type, "two")
  })

  test("multiple matches", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "one" })
    list.pushNode({ type: "two" })
    assert.throws(() => list.getNodeOfTypes("one", "two"), UserError)
  })

  test("no matches", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "one" })
    assert.throws(() => list.getNodeOfTypes("two"), UserError)
  })
})

suite("AstNodeList.getNodesOfTypes()", function () {
  test("normal", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "one" })
    list.pushNode({ type: "two" })
    list.pushNode({ type: "three" })
    const result = list.getNodesOfTypes("one", "three")
    assert.deepEqual(
      result.map((node) => node.type),
      ["one", "three"]
    )
  })
  test("opening nodes", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "one_open" })
    list.pushNode({ type: "two" })
    list.pushNode({ type: "one_close" })
    const result = list.getNodesOfTypes("one")
    assert.deepEqual(
      result.map((node) => node.type),
      ["one_open"]
    )
  })
})

test("AstNodeList.textInNode()", function () {
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

suite("AstNodeList.hasNodeOfType()", function () {
  test("contains the given node type", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "paragraph_open" })
    list.pushNode({ type: "paragraph_close" })
    assert.isTrue(list.hasNodeOfType("paragraph"))
  })

  test("doesn't contain the given node type", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "paragraph_open" })
    list.pushNode({ type: "paragraph_close" })
    assert.isFalse(list.hasNodeOfType("code"))
  })
})

test("AstNodeList.iterator()", function () {
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

test("AstNodeList.nodeTypes()", function () {
  const list = new AstNodeList()
  list.pushNode({ type: "type1" })
  list.pushNode({ type: "type2" })
  assert.deepEqual(list.nodeTypes(), ["type1", "type2"])
})

test("AstNodeList.push()", function () {
  const list = new AstNodeList()
  const node = AstNode.scaffold()
  list.push(node)
  assert.lengthOf(list, 1)
  assert.equal(list[0], node)
})

test("AstNodeList.scaffold()", function () {
  const list = new AstNodeList()
  list.pushNode({ type: "heading_open" })
  list.pushNode({ type: "text" })
  assert.lengthOf(list, 2)
  assert.equal(list[0].type, "heading_open")
  assert.equal(list[1].type, "text")
})

test("AstNodeList.text()", function () {
  const list = new AstNodeList()
  list.pushNode({ type: "code_open" })
  list.pushNode({ type: "text", content: "hello" })
  list.pushNode({ type: "text", content: "world" })
  list.pushNode({ type: "code_close" })
  const result = list.text()
  assert.equal(result, "hello world")
})

suite("AstNodeList.textInNodeOfType()", function () {
  test("type name given", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "code_open" })
    list.pushNode({ type: "text", content: "hello" })
    list.pushNode({ type: "code_close" })

    const result = list.textInNodeOfType("code")

    assert.equal(result, "hello")
  })

  test("opening type name given", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "code_open" })
    list.pushNode({ type: "text", content: "hello" })
    list.pushNode({ type: "code_close" })

    const result = list.textInNodeOfType("code_open")

    assert.equal(result, "hello")
  })

  test("multiple possible type names given", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "code_open" })
    list.pushNode({ type: "text", content: "hello" })
    list.pushNode({ type: "code_close" })
    const result = list.textInNodeOfType("code", "fence")
    assert.equal(result, "hello")
  })

  test("multiple matching nodes", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "code_open" })
    list.pushNode({ type: "text", content: "hello" })
    list.pushNode({ type: "code_close" })
    list.pushNode({ type: "fence_open" })
    list.pushNode({ type: "text", content: "world" })
    list.pushNode({ type: "fence_close" })
    assert.throws(() => list.textInNodeOfType("code", "fence"), UserError)
  })

  test("no matching nodes", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "code_open" })
    list.pushNode({ type: "text", content: "hello" })
    list.pushNode({ type: "code_close" })
    assert.throws(() => list.textInNodeOfType("fence"), UserError)
  })
})

suite("AstNodeList.textInNodeOfTypes()", function () {
  test("type name given", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "code_open" })
    list.pushNode({ type: "text", content: "hello" })
    list.pushNode({ type: "code_close" })
    const result = list.textInNodeOfTypes("code", "fence")
    assert.equal(result, "hello")
  })

  test("opening type name given", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "code_open" })
    list.pushNode({ type: "text", content: "hello" })
    list.pushNode({ type: "code_close" })
    const result = list.textInNodeOfTypes("code_open", "fence")
    assert.equal(result, "hello")
  })

  test("multiple matching nodes", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "code_open" })
    list.pushNode({ type: "text", content: "hello" })
    list.pushNode({ type: "code_close" })
    list.pushNode({ type: "fence_open" })
    list.pushNode({ type: "text", content: "world" })
    list.pushNode({ type: "fence_close" })
    assert.throws(() => list.textInNodeOfTypes("code", "fence"), UserError)
  })

  test("no matching nodes", function () {
    const list = new AstNodeList()
    list.pushNode({ type: "code_open" })
    list.pushNode({ type: "text", content: "hello" })
    list.pushNode({ type: "code_close" })
    assert.throws(() => list.textInNodeOfTypes("fence"), UserError)
  })
})

test("AstNodeList.textInNodesOfType()", function () {
  const list = new AstNodeList()
  list.pushNode({ type: "strongtext", content: "foo" })
  list.pushNode({ type: "strongtext", content: "bar" })
  const texts = list.textInNodesOfType("strongtext")
  assert.deepEqual(texts, ["foo", "bar"])
})
