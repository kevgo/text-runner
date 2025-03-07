import { assert } from "chai"
import { suite, test } from "node:test"

import { errorMessage } from "./error.js"
import { UserError } from "./user-error.js"

suite("errorMessage", () => {
  test("Error", () => {
    const give = new Error("hello")
    const want = "hello"
    const have = errorMessage(give)
    assert.equal(have, want)
  })

  test("number", () => {
    const give = 123
    const want = "123"
    const have = errorMessage(give)
    assert.equal(have, want)
  })

  test("UserError", () => {
    const give = new UserError("hello", "world")
    const want = "hello"
    const have = errorMessage(give)
    assert.equal(have, want)
  })
})
