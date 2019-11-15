import { assert } from "chai"
import { addLeadingDotUnlessEmpty } from "./add-leading-dot-unless-empty"

suite("addLeadingDotUnlessEmpty", function() {
  const tests = {
    foo: ".foo",
    ".foo": ".foo",
    "": ""
  }
  for (const [input, expected] of Object.entries(tests)) {
    test(input, function() {
      assert.equal(addLeadingDotUnlessEmpty(input), expected)
    })
  }
})
