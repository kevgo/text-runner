import { strict as assert } from "assert"
import { trimAllLineEnds } from "./trim-all-line-ends"

suite("trimAllLineEnds", function () {
  const tests = {
    hello: "hello",
    "one \n  two ": "one\n  two",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(trimAllLineEnds(give), want)
    })
  }
})
