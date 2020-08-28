import { assert } from "chai"
import { mergeConfigurations } from "./merge-configurations"
import { UserProvidedConfiguration } from "./types/user-provided-configuration"
import { defaultValues } from "./determine-configuration"
import { Configuration } from "./types/configuration"
import { Publications } from "./publications/publications"

suite("mergeConfigurations()", function () {
  test("no CLI args and config file data given", function () {
    const have = mergeConfigurations({}, {}, defaultValues)
    assert.deepEqual(have, defaultValues)
  })
  test("config file data given", function () {
    const configFileData: UserProvidedConfiguration = {
      exclude: "1.md",
    }
    const have = mergeConfigurations({}, configFileData, defaultValues)
    const want: Configuration = {
      defaultFile: "",
      exclude: "1.md",
      fileGlob: "**/*.md",
      formatterName: "detailed",
      offline: false,
      publications: new Publications(),
      regionMarker: "type",
      sourceDir: process.cwd(),
      useSystemTempDirectory: false,
      workspace: "",
    }
    assert.deepEqual(have, want)
  })

  test("complex example", function () {
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
