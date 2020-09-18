import { backfillDefaults } from "./backfill-defaults"
import { assert } from "chai"

suite("backfillDefaults", function () {
  test("no input", function () {
    const have = backfillDefaults({})
    assert.strictEqual(have.files, "**/*.md")
  })
})
