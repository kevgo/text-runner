import { assert } from "chai"
import { addLeadingSlash } from "./add-leading-slash"

suite("addLeadingSlash", function() {
  const tests = {
    foo: "/foo",
    "/foo": "/foo"
  }
  for (const [input, expected] of Object.entries(tests)) {
    test(input, function() {
      assert.equal(addLeadingSlash(input), expected)
    })
  }
})
