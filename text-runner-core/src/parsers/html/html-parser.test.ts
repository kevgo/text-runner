import { assert } from "chai"
import { suite, test } from "node:test"
import * as parse5 from "parse5"

import { standardizeHTMLAttributes } from "./html-parser.js"

suite("standardizeHTMLAttributes", function () {
  test("values", function () {
    const input: parse5.Token.Attribute[] = [
      { name: "one", value: "1" },
      { name: "two", value: "2" }
    ]
    const expected = { one: "1", two: "2" }
    assert.deepEqual(standardizeHTMLAttributes(input), expected)
  })

  test("empty", function () {
    assert.deepEqual(standardizeHTMLAttributes([]), {})
  })
})
