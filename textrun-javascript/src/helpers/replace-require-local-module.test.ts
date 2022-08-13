import { assert } from "chai"

import { replaceRequireLocalModule } from "./replace-require-local-module.js"

suite("replaceRequireLocalModule", function () {
  test("double-quotes", function () {
    const give = 'import * as foo from "."'
    const want = "const foo = import(process.cwd())"
    assert.equal(replaceRequireLocalModule(give), want)
  })
  test("single-quotes", function () {
    const give = "import * as foo from '.'"
    const want = "const foo = import(process.cwd())"
    assert.equal(replaceRequireLocalModule(give), want)
  })
})
