import { assert } from "chai"
import { suite, test } from "node:test"

import { replaceRequireLocalModule } from "./replace-require-local-module.js"

suite("replaceRequireLocalModule", () => {
  test("double-quotes", () => {
    const give = 'const foo = import(".")'
    const want = "const foo = import(process.cwd())"
    assert.equal(replaceRequireLocalModule(give), want)
  })
  test("single-quotes", () => {
    const give = "const foo = import('.')"
    const want = "const foo = import(process.cwd())"
    assert.equal(replaceRequireLocalModule(give), want)
  })
})
