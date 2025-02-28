import { suite, test } from "node:test"

import { assert } from "chai"

import * as helpers from "./index.js"

suite("camelize", function () {
  const tests = {
    foo: "foo",
    "one-two-three": "oneTwoThree",
    oneTwoThree: "oneTwoThree"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(helpers.camelize(give), want)
    })
  }
})
