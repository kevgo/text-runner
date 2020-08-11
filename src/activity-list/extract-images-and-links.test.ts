import { assert } from "chai"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { extractImagesAndLinks } from "./extract-images-and-links"

suite("extractImagesAndLinks", function () {
  test("extracting images", function () {
    const nodes = AstNodeList.scaffold({
      file: "filename",
      line: 3,
      type: "image",
    })
    const result = extractImagesAndLinks([nodes])
    assert.lengthOf(result, 1)
    assert.equal(result[0].actionName, "check-image")
    assert.equal(result[0].file.unixified(), "filename")
    assert.equal(result[0].line, 3)
    assert.lengthOf(result[0].nodes, 1)
    assert.equal(result[0].nodes[0], nodes[0])
  })

  test("extracting links", function () {
    const nodes = new AstNodeList()
    nodes.pushNode({ type: "link_open", file: "filename", line: 3 })
    nodes.pushNode({ type: "text", file: "filename", line: 3, content: "foo" })
    nodes.pushNode({ type: "link_close", file: "filename", line: 3 })
    const result = extractImagesAndLinks([nodes])
    assert.lengthOf(result, 1)
    assert.equal(result[0].actionName, "check-link")
    assert.equal(result[0].file.unixified(), "filename")
    assert.equal(result[0].line, 3)
    assert.deepEqual(result[0].nodes, nodes)
  })
})
