import { suite, test } from "node:test"

import { assert } from "chai"

import { targetURL } from "./target-url.js"

suite("targetURL", function () {
  const tests = {
    hello: "hello",
    "foo/bar-baz": "foobar-baz",
    CamelCase: "camelcase",
    "identity & access": "identity--access",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(targetURL(give), want)
    })
  }
})
