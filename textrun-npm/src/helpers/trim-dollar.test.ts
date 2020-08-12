import { trimDollar } from "./trim-dollar"
import { assert } from "chai"

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
