import { assert } from "chai"

import { isMailtoLink } from "./is-mailto-link.js"

suite("isMailtoLink", function () {
  const tests = {
    "mailto:foo@bar.com": true,
    foo: false
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(isMailtoLink(give), want)
    })
  }
})
