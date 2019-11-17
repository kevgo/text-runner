import { strict as assert } from "assert"
import { NameRefiner } from "./name-refiner"

suite("NameRefiner", function() {
  test("no refinements", function() {
    const refiner = new NameRefiner("original name")
    assert.equal(refiner.finalName(), "original name")
  })

  test("with refinements", function() {
    const refiner = new NameRefiner("original name")
    const refineFn = refiner.refineFn()
    refineFn("new name")
    refineFn("another name")
    assert.equal(refiner.finalName(), "another name")
  })
})
