import { assert } from "chai"

import * as ast from "../ast/index.js"
import { TagMapper } from "./tag-mapper.js"

const tagMapper = new TagMapper()

suite("TagMapper", function () {
  test(".isOpenCloseTag()", function () {
    assert.equal(tagMapper.isOpenCloseTag("a"), true)
  })

  test(".isStandaloneTag()", function () {
    assert.equal(tagMapper.isStandaloneTag("hr"), true)
  })

  test(".openingTypeForTag", function () {
    assert.equal(tagMapper.openingTypeForTag("b", {}), "bold_open")
    assert.equal(tagMapper.openingTypeForTag("/b", {}), "bold_open")
    assert.equal(tagMapper.openingTypeForTag("/a", {}), "anchor_open")
    assert.equal(tagMapper.openingTypeForTag("/a", { href: "foo" }), "link_open")
  })

  test(".tagForType()", function () {
    assert.equal(tagMapper.tagForType("bold_open"), "b", "known opening tag")
    assert.equal(tagMapper.tagForType("bold_close"), "/b", "known closing tag")
    assert.equal(tagMapper.tagForType("image"), "img", "known standalone tag")
    assert.equal(tagMapper.tagForType("foo_open" as ast.NodeType), "foo", "unknown opening tag")
    assert.equal(tagMapper.tagForType("foo_open" as ast.NodeType), "foo", "unknown closing tag")
    assert.equal(tagMapper.tagForType("foo" as ast.NodeType), "foo", "unknown standalone tag")
    assert.equal(tagMapper.tagForType("text"), "", "text tag")
  })

  test(".typeForTag()", () => {
    assert.equal(tagMapper.typeForTag("b", {}), "bold_open", "known opening tag")
    assert.equal(tagMapper.typeForTag("/b", {}), "bold_close", "known closing tag")
    assert.equal(tagMapper.typeForTag("img", {}), "image", "known standalone tag")
    assert.equal(tagMapper.typeForTag("a", {}), "anchor_open", "opening anchor")
    assert.equal(tagMapper.typeForTag("/a", {}), "anchor_close", "closing anchor")
    assert.equal(tagMapper.typeForTag("a", { href: "foo" }), "link_open", "opening link")
    assert.equal(tagMapper.typeForTag("/a", { href: "foo" }), "link_close", "closing anchor")
    assert.equal(tagMapper.typeForTag("foo" as ast.NodeTag, {}), "foo_open", "unknown opening tag")
    assert.equal(tagMapper.typeForTag("/foo" as ast.NodeTag, {}), "foo_close", "unknown closing tag")
  })
})
