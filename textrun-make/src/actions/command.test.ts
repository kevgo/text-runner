import { assert } from "chai"
import { suite, test } from "node:test"

import { getMakeTargets, trimDollar } from "./command.js"

suite("getMakeTargets", () => {
  test("exact match", () => {
    const have = getMakeTargets("make foo")
    assert.deepEqual(have, ["foo"])
  })
  test("match inside block", () => {
    const give = "$ echo start\n$ make foo\n$echo done"
    const have = getMakeTargets(give)
    assert.deepEqual(have, ["foo"])
  })
  test("empty block", () => {
    assert.deepEqual(getMakeTargets(""), [])
  })
})

suite("trimDollar", () => {
  const tests = {
    "$ foo": "foo",
    "$   foo": "foo",
    foo: "foo"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, () => {
      assert.equal(want, trimDollar(give))
    })
  }
})
