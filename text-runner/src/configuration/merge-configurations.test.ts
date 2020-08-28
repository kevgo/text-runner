import { assert } from "chai"
import { mergeConfigurations } from "./merge-configurations"
import { UserProvidedConfiguration } from "./types/user-provided-configuration"
import { defaultValues } from "./determine-configuration"

suite("mergeConfigurations()", function () {
  test("no CLI args and config file data given", function () {
    const result = mergeConfigurations({}, {}, defaultValues)
    assert.deepEqual(result, defaultValues)
  })

  test("xxx", function () {
    const cmdlineArgs: UserProvidedConfiguration = {
      fileGlob: "1.md",
      offline: false,
    }
    const configFileData: UserProvidedConfiguration = {
      command: "run",
      fileGlob: "**/*.md",
      offline: true,
    }
    const defaultValues: UserProvidedConfiguration = {
      fileGlob: "*.md",
    }
    const result = mergeConfigurations(cmdlineArgs, configFileData, defaultValues)
    assert.deepEqual(result, {
      command: "run",
      fileGlob: "1.md",
      offline: false,
    })
  })
})
