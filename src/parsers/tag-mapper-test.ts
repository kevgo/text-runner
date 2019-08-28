import { strict as assert } from "assert"
import { TagMapper } from "./tag-mapper"

const tagMapper = new TagMapper()

describe("TagMapper", () => {
  describe("isOpenCloseTag", function() {
    it("return TRUE for <a> tags", function() {
      assert.equal(tagMapper.isOpenCloseTag("a"), true)
    })
  })

  describe(".isStandaloneTag()", function() {
    it("recognizes known standalone tags", function() {
      assert.equal(tagMapper.isStandaloneTag("hr"), true)
    })
  })
  describe("openingTypeForTag", function() {
    it("returns opening types for opening HTML tags", function() {
      assert.equal(tagMapper.openingTypeForTag("b", {}), "bold_open")
    })

    it("returns opening types for closing HTML tags", () => {
      assert.equal(tagMapper.openingTypeForTag("/b", {}), "bold_open")
    })

    it("returns opening anchors", function() {
      assert.equal(tagMapper.openingTypeForTag("/a", {}), "anchor_open")
    })

    it("returns opening links", function() {
      assert.equal(
        tagMapper.openingTypeForTag("/a", { href: "foo" }),
        "link_open"
      )
    })
  })

  describe(".tagForType()", () => {
    it("maps known opening tags", () => {
      assert.equal(tagMapper.tagForType("bold_open"), "b")
    })

    it("maps known closing tags", () => {
      assert.equal(tagMapper.tagForType("bold_close"), "/b")
    })

    it("maps known standalone tags", () => {
      assert.equal(tagMapper.tagForType("image"), "img")
    })

    it("maps unknown opening tags", () => {
      assert.equal(tagMapper.tagForType("foo_open"), "foo")
    })

    it("maps unknown closing tags", () => {
      assert.equal(tagMapper.tagForType("foo_close"), "/foo")
    })

    it("maps unknown standalone tags", () => {
      assert.equal(tagMapper.tagForType("foo"), "foo")
    })

    it("maps text tags", () => {
      assert.equal(tagMapper.tagForType("text"), "")
    })
  })

  describe(".typeForTag()", () => {
    it("maps known opening tags", () => {
      assert.equal(tagMapper.typeForTag("b", {}), "bold_open")
    })

    it("maps known closing tags", () => {
      assert.equal(tagMapper.typeForTag("/b", {}), "bold_close")
    })

    it("maps known standalone tags", () => {
      assert.equal(tagMapper.typeForTag("img", {}), "image")
    })

    it("maps opening anchors", () => {
      assert.equal(tagMapper.typeForTag("a", {}), "anchor_open")
    })

    it("maps closing anchors", () => {
      assert.equal(tagMapper.typeForTag("/a", {}), "anchor_close")
    })

    it("maps opening links", () => {
      assert.equal(tagMapper.typeForTag("a", { href: "foo" }), "link_open")
    })

    it("maps closing anchors", () => {
      assert.equal(tagMapper.typeForTag("/a", { href: "foo" }), "link_close")
    })

    it("maps unknown opening tags", () => {
      assert.equal(tagMapper.typeForTag("foo", {}), "foo_open")
    })

    it("maps unknown closing tags", () => {
      assert.equal(tagMapper.typeForTag("/foo", {}), "foo_close")
    })
  })
})
