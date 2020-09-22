import { assert } from "chai"
import { hasCallbackPlaceholder } from "./has-callback-placeholder"

suite("hasCallbackPlaceholder", function () {
  const tests = {
    'fs.writeFile("foo", "bar", <CALLBACK>)': true,
    'fs.writeFile("foo", "bar", function() {\n  // ...\n})': true,
    'await fs.writeFile("foo", "bar")': false,
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(hasCallbackPlaceholder(give), want)
    })
  }
})
