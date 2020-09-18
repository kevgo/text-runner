import { assert } from "chai"
import { Publications } from "text-runner-core"
import { mergeConfigurations } from "./merge-configurations"
import { UserProvidedConfiguration } from "./user-provided-configuration"

suite("mergeConfigurations()", function () {
  test("empty inputs", function () {
    const have = mergeConfigurations({}, {})
    assert.deepEqual(have, { publications: new Publications() })
  })
  test("config file data given", function () {
    const configFileData: UserProvidedConfiguration = {
      exclude: "1.md",
      sourceDir: "my-source",
    }
    const have = mergeConfigurations({}, configFileData)
    const want: UserProvidedConfiguration = {
      exclude: "1.md",
      publications: new Publications(),
      sourceDir: "my-source",
    }
    assert.deepEqual(have, want)
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
      publications: new Publications(),
    })
  })
})
