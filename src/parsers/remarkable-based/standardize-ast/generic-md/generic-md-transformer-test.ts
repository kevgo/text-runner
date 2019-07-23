import { expect } from "chai"
import { AbsoluteFilePath } from "../../../../filesystem/absolute-file-path"
import { OpenTagTracker } from "../../helpers/open-tag-tracker"
import { TagMapper } from "../tag-mapper"
import { scaffoldRemarkableNode } from "../types/remarkable-node"
import { GenericMdTransformerCategory } from "./generic-md-transformer-category"

const transformer = new GenericMdTransformerCategory(new TagMapper())

describe("MdTransformer", function() {
  describe(".isOpeningType()", function() {
    it("returns TRUE for opening types", function() {
      expect(transformer.isOpeningType("bullet_list_open")).to.be.true
    })
    it("returns FALSE for closing types", function() {
      expect(transformer.isOpeningType("bullet_list_close")).to.be.false
    })
    it("returns FALSE for all other types", function() {
      expect(transformer.isOpeningType("bullet_list")).to.be.false
    })
  })

  describe(".isClosingType()", function() {
    it("returns TRUE for closing types", function() {
      expect(transformer.isClosingType("bullet_list_close")).to.be.true
    })
    it("returns FALSE for opening types", function() {
      expect(transformer.isClosingType("bullet_list_open")).to.be.false
    })
    it("returns FALSE for all other types", function() {
      expect(transformer.isClosingType("bullet_list")).to.be.false
    })
  })

  describe(".openingTypeFor()", function() {
    it("returns the opening type for the given known closing node type", function() {
      const actual = transformer.openingTypeFor("bullet_list_close")
      expect(actual).to.equal("bullet_list_open")
    })
    it("returns the opening type for the given unknown closing node type", function() {
      const actual = transformer.openingTypeFor("del_close")
      expect(actual).to.equal("del_open")
    })
  })

  describe(".transform()", function() {
    it("stores attributes of the original node", async function() {
      const node = scaffoldRemarkableNode({
        attributes: { foo: "bar" },
        type: "bullet_list_open"
      })
      const transformed = await transformer.transform(
        node,
        new AbsoluteFilePath("file.js"),
        12,
        new OpenTagTracker()
      )
      expect(transformed[0].attributes).to.eql({ foo: "bar" })
    })

    it("transforms bullet_list_open", async function() {
      const node = scaffoldRemarkableNode({ type: "bullet_list_open" })
      const transformed = await transformer.transform(
        node,
        new AbsoluteFilePath("file.js"),
        12,
        new OpenTagTracker()
      )
      expect(transformed).to.have.length(1)
      expect(transformed[0]).to.eql({
        attributes: {},
        content: "",
        file: { value: "file.js" }, // this is an AbsoluteFilePath
        line: 12,
        tag: "ul",
        type: "bullet_list_open"
      })
    })

    it("transforms bullet_list_close", async function() {
      // we need an open node before we can transform the closing node
      const openNode = scaffoldRemarkableNode({ type: "bullet_list_open" })
      const openTags = new OpenTagTracker()
      await transformer.transform(
        openNode,
        new AbsoluteFilePath("file.js"),
        12,
        openTags
      )

      // transform the closing node
      const closeNode = scaffoldRemarkableNode({ type: "bullet_list_close" })
      const transformed = await transformer.transform(
        closeNode,
        new AbsoluteFilePath("file.js"),
        12,
        openTags
      )
      expect(transformed).to.have.length(1)
      expect(transformed[0]).to.eql({
        attributes: {},
        content: "",
        file: { value: "file.js" }, // this is an AbsoluteFilePath
        line: 12,
        tag: "/ul",
        type: "bullet_list_close"
      })
    })
  })
})
