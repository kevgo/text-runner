import { assert } from "chai"
import { suite, test } from "node:test"

import { NameRefiner } from "./name-refiner.js"

suite("NameRefiner", () => {
  test("no refinements", () => {
    const refiner = new NameRefiner("original name")
    assert.equal(refiner.finalName(), "original name")
  })

  test("with refinements", () => {
    const refiner = new NameRefiner("original name")
    const refineFn = refiner.refineFn()
    refineFn("new name")
    refineFn("another name")
    assert.equal(refiner.finalName(), "another name")
  })
})
