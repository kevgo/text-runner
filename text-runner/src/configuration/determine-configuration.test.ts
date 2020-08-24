import { assert } from "chai"
import { determineConfiguration } from "./determine-configuration"

suite("loadConfiguration()", function () {
  test("no user config given", function () {
    const config = determineConfiguration({}, { command: "run" })
    assert.equal(config.fileGlob, "**/*.md")
  })

  test("user config given", async function () {
    const config = determineConfiguration({ fileGlob: "*.md" }, { command: "run" })
    assert.equal(config.fileGlob, "*.md")
  })
})
