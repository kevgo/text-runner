import { UserProvidedConfiguration } from "./user-provided-configuration"

/** default configuration values to use when no values are provided via CLI or config file */
export function defaultConfiguration(): UserProvidedConfiguration {
  return {
    configFileName: "text-run.yml",
    formatterName: "detailed",
  }
}
