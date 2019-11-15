import { strict as assert } from "assert"
import { TagMapper } from "./tag-mapper"

const tagMapper = new TagMapper()

test("TagMapper.isOpenCloseTag()", function() {
  assert.equal(tagMapper.isOpenCloseTag("a"), true)
})

test("TagMapper.isStandaloneTag()", function() {
  assert.equal(tagMapper.isStandaloneTag("hr"), true)
})

test("TagMapper.openingTypeForTag", function() {
  assert.equal(tagMapper.openingTypeForTag("b", {}), "bold_open")
  assert.equal(tagMapper.openingTypeForTag("/b", {}), "bold_open")
  assert.equal(tagMapper.openingTypeForTag("/a", {}), "anchor_open")
  assert.equal(tagMapper.openingTypeForTag("/a", { href: "foo" }), "link_open")
})

test("TagMapper.tagForType()", function() {
  const tests = [
    ["known opening tag", "bold_open", "b"],
    ["known closing tag", "bold_close", "/b"],
    ["known standalone tag", "image", "img"],
    ["unknown opening tag", "foo_open", "foo"],
    ["unknown closing tag", "foo_close", "/foo"],
    ["unknown standalone tag", "foo", "foo"],
    ["text tag", "text", ""]
  ]
  for (const [desc, input, expected] of tests) {
    test(desc, function() {
      assert.equal(tagMapper.tagForType(input), expected)
    })
  }
})

test("TagMapper.typeForTag()", () => {
  assert.equal(tagMapper.typeForTag("b", {}), "bold_open", "known opening tag")
  assert.equal(
    tagMapper.typeForTag("/b", {}),
    "bold_close",
    "known closing tag"
  )
  assert.equal(tagMapper.typeForTag("img", {}), "image", "known standalone tag")
  assert.equal(tagMapper.typeForTag("a", {}), "anchor_open", "opening anchor")
  assert.equal(tagMapper.typeForTag("/a", {}), "anchor_close", "closing anchor")
  assert.equal(
    tagMapper.typeForTag("a", { href: "foo" }),
    "link_open",
    "opening link"
  )
  assert.equal(
    tagMapper.typeForTag("/a", { href: "foo" }),
    "link_close",
    "closing anchor"
  )
  assert.equal(
    tagMapper.typeForTag("foo", {}),
    "foo_open",
    "unknown opening tag"
  )
  assert.equal(
    tagMapper.typeForTag("/foo", {}),
    "foo_close",
    "unknown closing tag"
  )
})
