import { assert } from "chai"
import { determineConfiguration } from "./determine-configuration"

suite("loadConfiguration()", function () {
  test("no user config given", function () {
    const config = determineConfiguration({}, {})
    assert.equal(config.files, "**/*.md")
  })

  test("user config given", async function () {
    const config = determineConfiguration({ files: "*.md" }, {})
    assert.equal(config.files, "*.md")
  })
})
