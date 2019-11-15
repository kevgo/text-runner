import { assert } from "chai"
import { removeTrailingColon } from "./remove-trailing-colon"

suite("removeTrailingColon", function() {
  const tests = {
    "foo:": "foo",
    foo: "foo"
  }
  for (const [input, expected] of Object.entries(tests)) {
    test(input, function() {
      assert.equal(removeTrailingColon(input), expected)
    })
  }
})
