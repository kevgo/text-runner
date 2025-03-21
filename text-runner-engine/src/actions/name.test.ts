import { assert } from "chai"
import { suite, test } from "node:test"

import { name } from "./name.js"

suite("getActionName()", () => {
  const tests = {
    "/users/foo/text-runner/text-runner/cdBack.js": "cd-back"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(give, () => {
      assert.equal(name(give), want)
    })
  }
})
