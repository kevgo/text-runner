import { UserProvidedConfiguration } from "./user-provided-configuration"

/** Merges the non-null values of the given objects */
export function mergeConfigurations(
  cliArgs: UserProvidedConfiguration,
  fileArgs: UserProvidedConfiguration
): UserProvidedConfiguration {
  const result: UserProvidedConfiguration = {}
  for (const [key, value] of Object.entries(fileArgs)) {
    // @ts-ignore
    result[key] = value
  }
  for (const [key, value] of Object.entries(cliArgs)) {
    // @ts-ignore
    result[key] = value
  }
  return result
}
