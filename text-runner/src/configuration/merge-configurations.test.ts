import { assert } from "chai"
import { mergeConfigurations } from "./merge-configurations"
import { UserProvidedConfiguration } from "./types/user-provided-configuration"

test("mergeConfigurations()", function () {
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
