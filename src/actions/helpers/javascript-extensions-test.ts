import { assert } from "chai"
import { javascriptExtensions } from "./javascript-extensions"

test("javascriptExtensions()", function() {
  const result = javascriptExtensions()
  assert.include(result, "coffee")
  assert.include(result, "js")
  assert.include(result, "ts")
})
