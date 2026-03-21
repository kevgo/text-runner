import { suite, test } from "node:test"
import { assert } from "chai"

import { addLeadingSlash } from "./add-leading-slash.js"

suite("addLeadingSlash", () => {
  const tests = {
    "/foo": "/foo",
    foo: "/foo"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, () => {
      assert.equal(addLeadingSlash(give), want)
    })
  }
})
