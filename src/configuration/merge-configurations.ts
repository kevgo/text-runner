import { allKeys } from "../helpers/all-keys"
import { UserProvidedConfiguration } from "./types/user-provided-configuration"

/** Merges the non-null values of the given objects */
export function mergeConfigurations(
  ...configs: UserProvidedConfiguration[]
): UserProvidedConfiguration {
  const result: UserProvidedConfiguration = {}
  for (const key of allKeys(...configs.reverse())) {
    for (const config of configs) {
      // @ts-ignore: expression is any
      if (config[key] != null) {
        // @ts-ignore: expression is any
        result[key] = config[key]
      }
    }
  }
  return result
}
