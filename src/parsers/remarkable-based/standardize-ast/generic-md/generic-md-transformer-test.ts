import { expect } from "chai"
import { AbsoluteFilePath } from "../../../../filesystem/absolute-file-path"
import { OpenTagTracker } from "../../helpers/open-tag-tracker"
import { TagMapper } from "../tag-mapper"
import { GenericMdTransformerBlock } from "./generic-md-transformer-category"

describe("MdTransformer", function() {
  beforeEach(function() {
    this.transformer = new GenericMdTransformerBlock(
      new OpenTagTracker(),
      new TagMapper()
    )
  })

  describe(".isOpeningType()", function() {
    it("returns TRUE for opening types", function() {
      expect(this.transformer.isOpeningType("bullet_list_open")).to.be.true
    })
    it("returns FALSE for closing types", function() {
      expect(this.transformer.isOpeningType("bullet_list_close")).to.be.false
    })
    it("returns FALSE for all other types", function() {
      expect(this.transformer.isOpeningType("bullet_list")).to.be.false
    })
  })

  describe(".isClosingType()", function() {
    it("returns TRUE for closing types", function() {
      expect(this.transformer.isClosingType("bullet_list_close")).to.be.true
    })
    it("returns FALSE for opening types", function() {
      expect(this.transformer.isClosingType("bullet_list_open")).to.be.false
    })
    it("returns FALSE for all other types", function() {
      expect(this.transformer.isClosingType("bullet_list")).to.be.false
    })
  })

  describe(".openingTypeFor()", function() {
    it("returns the opening type for the given known closing node type", function() {
      const actual = this.transformer.openingTypeFor("bullet_list_close")
      expect(actual).to.equal("bullet_list_open")
    })
    it("returns the opening type for the given unknown closing node type", function() {
      const actual = this.transformer.openingTypeFor("del_close")
      expect(actual).to.equal("del_open")
    })
  })

  describe(".transform()", function() {
    it("stores attributes of the original node", async function() {
      const node = { type: "bullet_list_open", attributes: { foo: "bar" } }
      const transformed = await this.transformer.transform(node, "file.js", 12)
      expect(transformed[0].attributes).to.eql({ foo: "bar" })
    })

    it("transforms bullet_list_open", async function() {
      const node = { type: "bullet_list_open" }
      const transformed = await this.transformer.transform(node, "file.js", 12)
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
      const openNode = { type: "bullet_list_open" }
      await this.transformer.transform(
        openNode,
        new AbsoluteFilePath("file.js"),
        12
      )

      // transform the closing node
      const closeNode = { type: "bullet_list_close" }
      const transformed = await this.transformer.transform(
        closeNode,
        new AbsoluteFilePath("file.js"),
        12
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
