import * as files from "../filesystem"
import { Data } from "./data"
import { Publications } from "./publications"

/** provides the default configuration values to use when no values are provided via CLI or config file */
export function defaults(): Data {
  return {
    regionMarker: "type",
    defaultFile: "",
    emptyWorkspace: true,
    exclude: [],
    files: "**/*.md",
    online: false,
    publications: new Publications(),
    scaffoldLanguage: "js",
    showSkipped: false,
    sourceDir: process.cwd(),
    systemTmp: false,
    workspace: new files.FullDir("tmp"),
  }
}
