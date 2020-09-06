import { Publications } from "../publications/publications"
import { FormatterName } from "../../formatters/formatter"

/**
 * All configuration values that are provided to the application
 * after analyzing the configuration provided by the user
 * and determining other runtime variables.
 */
export interface Configuration {
  regionMarker: string // the name of the attribute that denotes active regions
  defaultFile: string // the name of the default filename, set to '' if none is given
  exclude: string | string[] // list of names or regexes of files to exclude
  files: string // glob of the files to test
  formatterName: FormatterName // name of the Formatter class to use
  publications: Publications // folder mappings
  online: boolean // whether to skip built-in tests that require a network connection
  sourceDir: string // the root directory of the source code to test
  useSystemTempDirectory: boolean // whether to create the workspace in the system temp directory or locally
  workspace: string // the root directory of the workspace
}

export function defaultConfiguration(overrides: Partial<Configuration> = {}): Configuration {
  return {
    regionMarker: overrides.regionMarker ?? "type",
    defaultFile: overrides.defaultFile ?? "",
    exclude: overrides.exclude ?? [],
    files: overrides.files ?? "**/*.md",
    formatterName: overrides.formatterName ?? "detailed",
    online: overrides.online ?? false,
    publications: overrides.publications ?? new Publications(),
    sourceDir: overrides.sourceDir ?? process.cwd(),
    useSystemTempDirectory: overrides.useSystemTempDirectory ?? false,
    workspace: overrides.workspace ?? "", // will be populated later
  }
}
