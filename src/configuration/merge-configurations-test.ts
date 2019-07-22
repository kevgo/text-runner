import { expect } from "chai"
import { mergeConfigurations } from "./merge-configurations"
import { UserProvidedConfiguration } from "./types/user-provided-configuration"

describe("mergeConfigurations()", function() {
  it("merges the given UserProvidedConfiguration objects", function() {
    const cmdlineArgs: UserProvidedConfiguration = {
      fileGlob: "1.md",
      offline: false
    }
    const configFileData: UserProvidedConfiguration = {
      command: "run",
      fileGlob: "**/*.md",
      offline: true
    }
    const defaultValues: UserProvidedConfiguration = {
      fileGlob: "*.md",
      keepTmp: false
    }
    const result = mergeConfigurations(
      cmdlineArgs,
      configFileData,
      defaultValues
    )
    expect(result).to.eql({
      command: "run",
      fileGlob: "1.md",
      keepTmp: false,
      offline: false
    })
  })
})
