import { assert } from "chai"
import { suite, test } from "node:test"

import * as ast from "../ast/index.js"
import { extractImagesAndLinks } from "./extract-images-and-links.js"

suite("extractImagesAndLinks", function() {
  test("extracting images", function() {
    const nodes = ast.NodeList.scaffold({
      file: "filename",
      line: 3,
      type: "image"
    })
    const result = extractImagesAndLinks([nodes])
    assert.lengthOf(result, 1)
    assert.equal(result[0].actionName, "check-image")
    assert.equal(result[0].location.file.unixified(), "filename")
    assert.equal(result[0].location.line, 3)
    assert.lengthOf(result[0].region, 1)
    assert.equal(result[0].region[0], nodes[0])
    assert.lengthOf(result[0].document, 1)
    assert.equal(result[0].document[0], nodes[0])
  })

  test("extracting links", function() {
    const nodes = new ast.NodeList()
    nodes.pushNode({ file: "filename", line: 3, type: "link_open" })
    nodes.pushNode({ content: "foo", file: "filename", line: 3, type: "text" })
    nodes.pushNode({ file: "filename", line: 3, type: "link_close" })
    const result = extractImagesAndLinks([nodes])
    assert.lengthOf(result, 1)
    assert.equal(result[0].actionName, "check-link")
    assert.equal(result[0].location.file.unixified(), "filename")
    assert.equal(result[0].location.line, 3)
    assert.deepEqual(result[0].region, nodes)
    assert.deepEqual(result[0].document, nodes)
  })
})
