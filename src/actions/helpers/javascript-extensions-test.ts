import { assert } from "chai"
import { javascriptExtensions } from "./javascript-extensions"

describe("javascriptExtensions", function() {
  it("returns all supported JS extensions", function() {
    const result = javascriptExtensions()
    assert.include(result, "coffee")
    assert.include(result, "js")
    assert.include(result, "ts")
  })
})
