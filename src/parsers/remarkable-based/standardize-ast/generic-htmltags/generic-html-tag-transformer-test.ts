import { expect } from "chai"
import { AbsoluteFilePath } from "../../../../filesystem/absolute-file-path"
import { TagMapper } from "../../../tag-mapper"
import { OpenTagTracker } from "../../helpers/open-tag-tracker"
import {
  RemarkableNode,
  scaffoldRemarkableNode
} from "../types/remarkable-node"
import { GenericHtmlTagTransformerCategory } from "./generic-html-tag-transformer-category"

const transformer = new GenericHtmlTagTransformerCategory(new TagMapper())
const file = new AbsoluteFilePath("foo")
const openingNode: RemarkableNode = scaffoldRemarkableNode({
  content: '<foo class="myClass">',
  type: "htmltag"
})

describe("GenericHtmlTagTransformer", function() {
  describe(".transform()", function() {
    describe("tranforming opening nodes", function() {
      beforeEach(async function() {
        this.actual = await transformer.transform(
          openingNode,
          file,
          3,
          new OpenTagTracker()
        )
      })
      it("returns the corresponding AstNode", function() {
        expect(this.actual).to.have.length(1)
      })
      it("assigns the attributes of the opening tag", function() {
        expect(this.actual[0].attributes).to.eql({ class: "myClass" })
      })
    })
  })
})
