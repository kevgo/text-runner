import { assert } from "chai"
import { suite, test } from "node:test"

import { addLeadingDotUnlessEmpty } from "./add-leading-dot-unless-empty.js"

suite("addLeadingDotUnlessEmpty", () => {
  const tests = {
    "": "",
    ".foo": ".foo",
    foo: ".foo"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, () => {
      assert.equal(addLeadingDotUnlessEmpty(give), want)
    })
  }
})
