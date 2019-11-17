import { expect } from "chai"
import { allKeys } from "./all-keys"

test("allKeys()", function() {
  const obj1 = { a: 1 }
  const obj2 = { b: 1 }
  const obj3 = { c: 1 }
  const actual = allKeys(obj1, obj2, obj3)
  expect(actual).to.eql(["a", "b", "c"])
})
