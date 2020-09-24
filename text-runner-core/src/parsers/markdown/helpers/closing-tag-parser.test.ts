import { assert } from "chai"
import { AbsoluteFilePath } from "../../../filesystem/absolute-file-path"
import * as ast from "../../../ast"
import { TagMapper } from "../../tag-mapper"
import { ClosingTagParser } from "./closing-tag-parser"

suite("ClosingTagParser.isClosingTag()", function () {
  const testData = {
    "  < / a > ": true,
    "  </a> ": true,
    " < a  > ": false,
    "</a>": true,
    "<a>": false,
  }
  const parser = new ClosingTagParser(new TagMapper())
  for (const [input, expected] of Object.entries(testData)) {
    test(`'${input}' --> ${expected}`, function () {
      assert.equal(parser.isClosingTag(input), expected)
    })
  }
})

test("ClosingTagParser.parse()", function () {
  const parser = new ClosingTagParser(new TagMapper())
  const file = new AbsoluteFilePath("filepath")
  const line = 12
  const actual = parser.parse("  < / a >  ", file, line)
  const expected = ast.NodeList.scaffold({
    attributes: {},
    content: "",
    file,
    line,
    tag: "/a",
    type: "anchor_close",
  })
  assert.deepEqual(actual, expected)
})
