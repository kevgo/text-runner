import { suite, test } from "node:test"

import { assert } from "chai"

import { isLinkToAnchorInOtherFile } from "./is-link-to-anchor-in-other-file.js"

suite("isLinkToAnchorInOtherFile()", function () {
  const tests = {
    "foo.md#bar": true,
    "#foo": false,
    "foo.md": false,
    "https://foo.com/bar": false,
    "https://foo.com/bar#baz": false,
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} is ${want}`, function () {
      assert.equal(isLinkToAnchorInOtherFile(give), want)
    })
  }
})
