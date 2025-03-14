import { assert } from "chai"
import { suite, test } from "node:test"

import * as helpers from "./index.js"

suite("camelize", () => {
  const tests = {
    foo: "foo",
    "one-two-three": "oneTwoThree",
    oneTwoThree: "oneTwoThree"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, () => {
      assert.equal(helpers.camelize(give), want)
    })
  }
})
