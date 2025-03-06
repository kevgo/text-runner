import { assert } from "chai"
import { suite, test } from "node:test"

import { replaceVariableDeclarations } from "./replace-variable-declarations.js"

suite("replaceVariableDeclarations", function() {
  const tests = {
    "const foo = 123": "global.foo = 123",
    "let foo = 123": "global.foo = 123",
    "this.foo = 123": "global.foo = 123",
    "var foo = 123": "global.foo = 123"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function() {
      assert.equal(replaceVariableDeclarations(give), want)
    })
  }
})
