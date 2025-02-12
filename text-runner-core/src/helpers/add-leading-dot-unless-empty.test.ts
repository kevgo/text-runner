import { assert } from "chai"

import { addLeadingDotUnlessEmpty } from "./add-leading-dot-unless-empty.js"

suite("addLeadingDotUnlessEmpty", function () {
  const tests = {
    foo: ".foo",
    ".foo": ".foo",
    "": ""
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(addLeadingDotUnlessEmpty(give), want)
    })
  }
})
