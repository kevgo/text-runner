import { suite, test } from "node:test"

import { assert } from "chai"

import { getMakeTargets, trimDollar } from "./command.js"

suite("getMakeTargets", function () {
  test("exact match", function () {
    const have = getMakeTargets("make foo")
    assert.deepEqual(have, ["foo"])
  })
  test("match inside block", function () {
    const give = "$ echo start\n$ make foo\n$echo done"
    const have = getMakeTargets(give)
    assert.deepEqual(have, ["foo"])
  })
  test("empty block", function () {
    assert.deepEqual(getMakeTargets(""), [])
  })
})

suite("trimDollar", function () {
  const tests = {
    foo: "foo",
    "$ foo": "foo",
    "$   foo": "foo",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(want, trimDollar(give))
    })
  }
})
