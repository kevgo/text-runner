import { strict as assert } from "assert"
import { standardizeHTMLAttributes } from "./standardize-html-attributes"
import * as parse5 from "parse5"

suite("standardizeHTMLAttributes", function () {
  test("values", function () {
    const input: parse5.Attribute[] = [
      { name: "one", value: "1" },
      { name: "two", value: "2" },
    ]
    const expected = { one: "1", two: "2" }
    assert.deepEqual(standardizeHTMLAttributes(input), expected)
  })

  test("empty", function () {
    assert.deepEqual(standardizeHTMLAttributes([]), {})
  })
})
