import { assert } from "chai"

import { backfillDefaults } from "./backfill-defaults"

suite("backfillDefaults", function () {
  test("no input", function () {
    const have = backfillDefaults({})
    assert.strictEqual(have.files, "**/*.md")
  })
  test("input", function () {
    const have = backfillDefaults({ files: "1.md", regionMarker: "foo" })
    assert.strictEqual(have.files, "1.md")
    assert.strictEqual(have.regionMarker, "foo")
  })
})
