import { expect } from "chai"
import { test } from "node:test"

import * as helpers from "./index.js"

test("allKeys()", () => {
  const obj1 = { a: "1" }
  const obj2 = { b: "1" }
  const obj3 = { c: "1" }
  const actual = helpers.allKeys(obj1, obj2, obj3)
  expect(actual).to.eql(["a", "b", "c"])
})
