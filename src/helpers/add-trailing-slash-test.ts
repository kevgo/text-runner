import { assert } from "chai"
import { addTrailingSlash } from "./add-trailing-slash"

suite("addTrailingSlash", function() {
  const tests = {
    foo: "foo/",
    "foo/": "foo/"
  }
  for (const [input, expected] of Object.entries(tests)) {
    test(input, function() {
      assert.equal(addTrailingSlash(input), expected)
    })
  }
})
