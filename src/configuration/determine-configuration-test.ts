import { assert } from "chai"
import { determineConfiguration } from "./determine-configuration"

suite("loadConfiguration", function() {
  test("no config file given", function() {
    const result = determineConfiguration({}, { command: "" })
    assert.equal(result.fileGlob, "**/*.md")
  })

  test("config file given", async function() {
    const result = determineConfiguration({ fileGlob: "*.md" }, { command: "" })
    assert.equal(result.fileGlob, "*.md")
  })
})
