import { assert } from "chai"
import { suite, test } from "node:test"

import * as config from "./index.js"

suite("addDefaults", function () {
  test("no input", async function () {
    const have = await config.addDefaults({})
    assert.strictEqual(have.files, "**/*.md")
    const want = "text-runner-engine/tmp"
    if (!have.workspace.unixified().endsWith(want)) {
      throw new Error(`expected ${have.workspace.unixified()} to end with ${want}`)
    }
  })
  test("input", async function () {
    const have = await config.addDefaults({ files: "1.md", regionMarker: "foo" })
    assert.strictEqual(have.files, "1.md")
    assert.strictEqual(have.regionMarker, "foo")
  })
})
