import { assert } from "chai"
import { targetURL } from "./target-url"

suite("targetURL", function () {
  const tests = {
    hello: "hello",
    "foo/bar-baz": "foobar-baz",
    CamelCase: "camelcase",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(targetURL(give), want)
    })
  }
})
