import { allKeys } from "../helpers/all-keys"
import { UserProvidedConfiguration } from "./user-provided-configuration"
import * as tr from "text-runner-core"

/** Merges the non-null values of the given objects */
export function mergeConfigurations(...configs: UserProvidedConfiguration[]): UserProvidedConfiguration {
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
  result.publications = tr.Publications.fromJSON(result.publications).sorted()
  return result
}
