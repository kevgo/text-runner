import { assert } from "chai"

import { addLeadingSlash } from "./add-leading-slash.js"

suite("addLeadingSlash", function () {
  const tests = {
    foo: "/foo",
    "/foo": "/foo"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(addLeadingSlash(give), want)
    })
  }
})
