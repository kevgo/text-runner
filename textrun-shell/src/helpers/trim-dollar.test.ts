import { assert } from "chai"
import { suite, test } from "node:test"

import { trimDollar } from "./trim-dollar.js"

suite("trimDollar", function () {
  const tests = {
    foo: "foo",
    "$ foo": "foo",
    "$   foo": "foo",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(want, trimDollar(give))
    })
  }
})
