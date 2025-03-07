import { assert } from "chai"
import { suite, test } from "node:test"

import { isLinkToAnchorInOtherFile } from "./is-link-to-anchor-in-other-file.js"

suite("isLinkToAnchorInOtherFile()", () => {
  const tests = {
    "#foo": false,
    "foo.md": false,
    "foo.md#bar": true,
    "https://foo.com/bar": false,
    "https://foo.com/bar#baz": false
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} is ${want}`, () => {
      assert.equal(isLinkToAnchorInOtherFile(give), want)
    })
  }
})
