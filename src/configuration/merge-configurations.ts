import { allKeys } from "../helpers/all-keys"
import { UserProvidedConfiguration } from "./user-provided-configuration"

/** Merges the non-null values of the given objects */
export function mergeConfigurations(
  ...configs: UserProvidedConfiguration[]
): UserProvidedConfiguration {
  const result: UserProvidedConfiguration = {}
  for (const key of allKeys(...configs.reverse())) {
    for (const config of configs) {
      if (config[key] != null) {
        result[key] = config[key]
      }
    }
  }
  return result
}
