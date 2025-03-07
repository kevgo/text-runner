import { assert } from "chai"
import { suite, test } from "node:test"

import { appendAsyncCallback } from "./append-async-callback.js"

suite("appendAsyncCallback", () => {
  test("synchronous code", () => {
    const give = `\
console.log(123)`
    const have = appendAsyncCallback(give)
    const want = `\
console.log(123);
__finished();`
    assert.equal(have, want)
  })
})
