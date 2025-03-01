import { assert } from "chai"
import { suite, test } from "node:test"

import { targetURL } from "./target-url.js"

suite("targetURL", function () {
  const tests = {
    CamelCase: "camelcase",
    "foo/bar-baz": "foobar-baz",
    hello: "hello",
    "identity & access": "identity--access"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(targetURL(give), want)
    })
  }
})
