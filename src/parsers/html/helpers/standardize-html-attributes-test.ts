import { strict as assert } from "assert"
import { standardizeHTMLAttributes } from "./standardize-html-attributes"

describe("standardizeHTMLAttributes", function() {
  it("standardizes the given HTML attributes", function() {
    const input = [{ name: "one", value: 1 }, { name: "two", value: 2 }]
    const expected = { one: 1, two: 2 }
    assert.deepEqual(standardizeHTMLAttributes(input), expected)
  })

  it("handles null", function() {
    assert.deepEqual(standardizeHTMLAttributes(null), {})
  })
})
