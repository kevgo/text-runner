import { strict as assert } from "assert"
import { TagMapper } from "./tag-mapper"
import { AstNodeTag, AstNodeType } from "./standard-AST/ast-node"

const tagMapper = new TagMapper()

test("TagMapper.isOpenCloseTag()", function () {
  assert.equal(tagMapper.isOpenCloseTag("a"), true)
})

test("TagMapper.isStandaloneTag()", function () {
  assert.equal(tagMapper.isStandaloneTag("hr"), true)
})

test("TagMapper.openingTypeForTag", function () {
  assert.equal(tagMapper.openingTypeForTag("b", {}), "bold_open")
  assert.equal(tagMapper.openingTypeForTag("/b", {}), "bold_open")
  assert.equal(tagMapper.openingTypeForTag("/a", {}), "anchor_open")
  assert.equal(tagMapper.openingTypeForTag("/a", { href: "foo" }), "link_open")
})

test("TagMapper.tagForType()", function () {
  assert.equal(tagMapper.tagForType("bold_open"), "b", "known opening tag")
  assert.equal(tagMapper.tagForType("bold_close"), "/b", "known closing tag")
  assert.equal(tagMapper.tagForType("image"), "img", "known standalone tag")
  assert.equal(tagMapper.tagForType("foo_open" as AstNodeType), "foo", "unknown opening tag")
  assert.equal(tagMapper.tagForType("foo_open" as AstNodeType), "foo", "unknown closing tag")
  assert.equal(tagMapper.tagForType("foo" as AstNodeType), "foo", "unknown standalone tag")
  assert.equal(tagMapper.tagForType("text"), "", "text tag")
})

test("TagMapper.typeForTag()", () => {
  assert.equal(tagMapper.typeForTag("b", {}), "bold_open", "known opening tag")
  assert.equal(tagMapper.typeForTag("/b", {}), "bold_close", "known closing tag")
  assert.equal(tagMapper.typeForTag("img", {}), "image", "known standalone tag")
  assert.equal(tagMapper.typeForTag("a", {}), "anchor_open", "opening anchor")
  assert.equal(tagMapper.typeForTag("/a", {}), "anchor_close", "closing anchor")
  assert.equal(tagMapper.typeForTag("a", { href: "foo" }), "link_open", "opening link")
  assert.equal(tagMapper.typeForTag("/a", { href: "foo" }), "link_close", "closing anchor")
  assert.equal(tagMapper.typeForTag("foo" as AstNodeTag, {}), "foo_open", "unknown opening tag")
  assert.equal(tagMapper.typeForTag("/foo" as AstNodeTag, {}), "foo_close", "unknown closing tag")
})