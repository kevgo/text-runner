import { Publications } from "./publications/publications"
import { Configuration } from "./configuration"

/** provides the default configuration values to use when no values are provided via CLI or config file */
export function defaultConfiguration(): Configuration {
  return {
    regionMarker: "type",
    defaultFile: "",
    exclude: [],
    files: "**/*.md",
    online: false,
    publications: new Publications(),
    formatterName: "detailed",
    scaffoldLanguage: "js",
    sourceDir: process.cwd(),
    systemTmp: false,
    workspace: "", // will be populated later
  }
}
