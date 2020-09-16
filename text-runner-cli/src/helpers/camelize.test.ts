import { strict as assert } from "assert"
import { camelize } from "./camelize"

suite("camelize", function () {
  const tests = {
    foo: "foo",
    "one-two-three": "oneTwoThree",
    oneTwoThree: "oneTwoThree",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(camelize(give), want)
    })
  }
})
