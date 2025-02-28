import { suite, test } from "node:test"

import { assert } from "chai"

import * as ast from "../../ast/index.js"
import * as files from "../../filesystem/index.js"
import { TagMapper } from "../tag-mapper.js"
import { ClosingTagParser } from "./closing-tag-parser.js"

suite("ClosingTagParser.isClosingTag()", function () {
  const testData = {
    "  < / a > ": true,
    "  </a> ": true,
    " < a  > ": false,
    "</a>": true,
    "<a>": false
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
  const location = new files.Location(new files.SourceDir(""), new files.FullFilePath("filepath"), 12)
  const actual = parser.parse("  < / a >  ", location)
  const expected = ast.NodeList.scaffold({
    attributes: {},
    content: "",
    file: location.file,
    line: location.line,
    tag: "/a",
    type: "anchor_close"
  })
  assert.deepEqual(actual, expected)
})
