import { assert } from "chai"
import fs from "fs-extra"
import path from "path"
import tmp from "tmp-promise"
import { determineConfiguration } from "./determine-configuration"

describe("loadConfiguration", function() {
  it("returns default values if no config file is given", function() {
    const result = determineConfiguration({}, { command: "" })
    assert.equal(result.fileGlob, "**/*.md")
  })

  context("config file given", function() {
    beforeEach(async function() {
      this.configDir = await tmp.dir()
      this.configFilePath = path.join(this.configDir.name, "text-run.yml")
      await fs.writeFile(this.configFilePath, "files: '*.md'")
      const result = determineConfiguration({}, { command: "" })
      assert.equal(result.fileGlob, "*.md")
    })
  })
})
