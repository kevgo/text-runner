import { strict as assert } from "assert"
import { mergeConfigurations } from "./merge-configurations"
import { UserProvidedConfiguration } from "./user-provided-configuration"

suite("mergeConfigurations()", function () {
  test("empty inputs", function () {
    const have = mergeConfigurations({}, {})
    assert.deepEqual(have, {})
  })
  test("config file data given", function () {
    const configFileData: UserProvidedConfiguration = {
      exclude: "1.md",
      sourceDir: "my-source",
    }
    const have = mergeConfigurations({}, configFileData)
    assert.deepEqual(have, configFileData)
  })

  test("userConfig overrides fileConfig", function () {
    const cmdlineArgs: UserProvidedConfiguration = {
      files: "1.md",
      online: false,
    }
    const configFileData: UserProvidedConfiguration = {
      formatterName: "dot",
      files: "**/*.md",
      online: true,
    }
    const result = mergeConfigurations(cmdlineArgs, configFileData)
    assert.deepEqual(result, {
      formatterName: "dot",
      files: "1.md",
      online: false,
    })
  })
})
