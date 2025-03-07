import { assert } from "chai"
import { suite, test } from "node:test"

import { hasCallbackPlaceholder } from "./has-callback-placeholder.js"

suite("hasCallbackPlaceholder", () => {
  const tests = {
    'await fs.writeFile("foo", "bar")': false,
    'fs.writeFile("foo", "bar", () => {\n  // ...\n})': true,
    'fs.writeFile("foo", "bar", <CALLBACK>)': true
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, () => {
      assert.equal(hasCallbackPlaceholder(give), want)
    })
  }
})
