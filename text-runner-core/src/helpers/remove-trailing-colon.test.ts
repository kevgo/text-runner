import { suite, test } from "node:test"

import { assert } from "chai"

import { removeTrailingColon } from "./remove-trailing-colon.js"

suite("removeTrailingColon", function () {
  const tests = {
    "foo:": "foo",
    foo: "foo",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(removeTrailingColon(give), want)
    })
  }
})
