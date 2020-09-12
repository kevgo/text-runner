import { Publications } from "./publications/publications"
import { Configuration } from "./configuration"


  /** provides the default configuration values to use when no values are provided via CLI or config file */
export function defaultConfiguration(): Configuration {
  return {
    regionMarker: "type",
    defaultFile: "",
    exclude: [],
    files: "**/*.md",
    formatterName: "detailed",
    online: false,
    publications: new Publications(),
    scaffoldLanguage: "js",
    sourceDir: process.cwd(),
    useSystemTempDirectory: false,
    workspace: "", // will be populated later
  }
}
