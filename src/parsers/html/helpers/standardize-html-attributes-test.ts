import { strict as assert } from "assert"
import { standardizeHTMLAttributes } from "./standardize-html-attributes"

suite("standardizeHTMLAttributes", function() {
  test("non-null", function() {
    const input = [{ name: "one", value: 1 }, { name: "two", value: 2 }]
    const expected = { one: 1, two: 2 }
    assert.deepEqual(standardizeHTMLAttributes(input), expected)
  })

  test("handles null", function() {
    assert.deepEqual(standardizeHTMLAttributes(null), {})
  })
})
