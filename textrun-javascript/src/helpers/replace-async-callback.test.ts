import { suite, test } from "node:test"
import { assert } from "chai"

import { replaceAsyncCallback } from "./replace-async-callback.js"

suite("replaceAsyncCallback", () => {
  test("<CALLBACK>", () => {
    const give = 'fs.writeFile("foo", "bar", <CALLBACK>)'
    const want = 'fs.writeFile("foo", "bar", __finished)'
    assert.equal(replaceAsyncCallback(give), want)
  })
  test("// ...", () => {
    const give = `\
fs.writeFile("foo", "bar", () => {
  // ...
})`
    const want = `\
fs.writeFile("foo", "bar", () => {
  __finished();
})`
    assert.equal(replaceAsyncCallback(give), want)
  })
})
