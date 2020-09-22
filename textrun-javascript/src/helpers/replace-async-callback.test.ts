import { replaceAsyncCallback } from "./replace-async-callback"
import { assert } from "chai"

suite("replaceAsyncCallback", function () {
  test("<CALLBACK>", function () {
    const give = 'fs.writeFile("foo", "bar", <CALLBACK>)'
    const want = 'fs.writeFile("foo", "bar", __finished)'
    assert.equal(replaceAsyncCallback(give), want)
  })
  test("// ...", function () {
    const give = `\
fs.writeFile("foo", "bar", function() {
  // ...
})`
    const want = `\
fs.writeFile("foo", "bar", function() {
  __finished();
})`
    assert.equal(replaceAsyncCallback(give), want)
  })
})
