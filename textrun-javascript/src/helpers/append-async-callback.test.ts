import { assert } from "chai"

import { appendAsyncCallback } from "./append-async-callback.js"

suite("appendAsyncCallback", function () {
  test("synchronous code", function () {
    const give = `\
console.log(123)`
    const have = appendAsyncCallback(give)
    const want = `\
console.log(123);
__finished();`
    assert.equal(have, want)
  })
})
