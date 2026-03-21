import { suite, test } from "node:test"
import { assert } from "chai"

import { isMailtoLink } from "./is-mailto-link.js"

suite("isMailtoLink", () => {
  const tests = {
    foo: false,
    "mailto:foo@bar.com": true
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, () => {
      assert.equal(isMailtoLink(give), want)
    })
  }
})
