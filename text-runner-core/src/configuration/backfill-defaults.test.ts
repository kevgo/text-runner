import { assert } from "chai"

import { backfillDefaults } from "./backfill-defaults"

suite("backfillDefaults", function () {
  test("no input", async function () {
    const have = await backfillDefaults({})
    assert.strictEqual(have.files, "**/*.md")
    const want = "text-runner-core/tmp"
    if (!have.workspace.unixified().endsWith(want)) {
      throw new Error(`expected ${have.workspace.unixified()} to end with ${want}`)
    }
  })
  test("input", async function () {
    const have = await backfillDefaults({ files: "1.md", regionMarker: "foo" })
    assert.strictEqual(have.files, "1.md")
    assert.strictEqual(have.regionMarker, "foo")
  })
})
