import { UserProvidedConfiguration } from "./user-provided-configuration"
import * as tr from "text-runner-core"

/** Merges the non-null values of the given objects */
export function mergeConfigurations(
  cliArgs: UserProvidedConfiguration,
  fileArgs: UserProvidedConfiguration
): UserProvidedConfiguration {
  const result: UserProvidedConfiguration = {}
  for (const [key, value] of Object.entries(fileArgs)) {
    if (value != null) {
      // @ts-ignore
      result[key] = value
    }
  }
  for (const [key, value] of Object.entries(cliArgs)) {
    if (value != null) {
      // @ts-ignore
      result[key] = value
    }
  }
  result.publications = tr.Publications.fromJSON(result.publications).sorted()
  return result
}
