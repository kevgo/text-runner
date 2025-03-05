import { assert } from "chai"
import { suite, test } from "node:test"

import { hasCallbackPlaceholder } from "./has-callback-placeholder.js"

suite("hasCallbackPlaceholder", function() {
  const tests = {
    'await fs.writeFile("foo", "bar")': false,
    'fs.writeFile("foo", "bar", <CALLBACK>)': true,
    'fs.writeFile("foo", "bar", function() {\n  // ...\n})': true
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function() {
      assert.equal(hasCallbackPlaceholder(give), want)
    })
  }
})
