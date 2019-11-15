import { assert } from "chai"
import fs from "fs-extra"
import path from "path"
import tmp from "tmp-promise"
import { determineConfiguration } from "./determine-configuration"

suite("loadConfiguration", function() {
  test("no config file given", function() {
    const result = determineConfiguration({}, { command: "" })
    assert.equal(result.fileGlob, "**/*.md")
  })

  test("config file given", async function() {
    const configDir = await tmp.dir()
    const configFilePath = path.join(configDir.path, "text-run.yml")
    await fs.writeFile(configFilePath, "files: '*.md'")
    const result = determineConfiguration({}, { command: "" })
    assert.equal(result.fileGlob, "*.md")
  })
})
