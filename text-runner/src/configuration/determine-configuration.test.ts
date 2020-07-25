import { assert } from "chai"
import { determineConfiguration } from "./determine-configuration"

suite("loadConfiguration()", function () {
  test("no user config given", function () {
    const config = determineConfiguration({}, { command: "" })
    assert.equal(config.fileGlob, "**/*.md")
  })

  test("user config given", async function () {
    const config = determineConfiguration({ fileGlob: "*.md" }, { command: "" })
    assert.equal(config.fileGlob, "*.md")
  })
})
