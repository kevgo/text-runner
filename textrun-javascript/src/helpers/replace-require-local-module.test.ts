import { assert } from "chai"
import { replaceRequireLocalModule } from "./replace-require-local-module"

suite("replaceRequireLocalModule", function () {
  test("double-quotes", function () {
    const give = 'const foo = require(".")'
    const want = "const foo = require(process.cwd())"
    assert.equal(replaceRequireLocalModule(give), want)
  })
  test("single-quotes", function () {
    const give = "const foo = require('.')"
    const want = "const foo = require(process.cwd())"
    assert.equal(replaceRequireLocalModule(give), want)
  })
})
