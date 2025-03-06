import { assert } from "chai"
import { suite, test } from "node:test"

import { isMailtoLink } from "./is-mailto-link.js"

suite("isMailtoLink", function() {
  const tests = {
    foo: false,
    "mailto:foo@bar.com": true
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function() {
      assert.equal(isMailtoLink(give), want)
    })
  }
})
