import * as path from "path"
import * as tmp from "tmp-promise"

import { UserError } from "../errors/user-error"
import * as files from "../filesystem"
import * as configuration from "."
import { Publications } from "./publications"

/** provides the default configuration values to use when no values are provided via CLI or config file */
export function defaults(): configuration.CompleteAPIData {
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
    sourceDir: new files.AbsoluteDir(process.cwd()),
    systemTmp: false,
    workspace: "tmp",
  }
}

export async function addDefaults(partial: configuration.APIData): Promise<configuration.Data> {
  const fullAPIData = defaults()
  for (const [key, value] of Object.entries(partial)) {
    if (value != null) {
      // @ts-ignore
      fullAPIData[key] = value
    }
  }
  const result = { ...fullAPIData, workspace: await getWorkspacePath(fullAPIData) }
  return result
}

async function getWorkspacePath(config: configuration.CompleteAPIData): Promise<files.AbsoluteDir> {
  if (config.systemTmp === false) {
    return new files.AbsoluteDir(config.sourceDir?.joinStr(config.workspace || "") || "")
  } else if (config.systemTmp === true) {
    const tmpDir = await tmp.dir()
    return new files.AbsoluteDir(path.join(tmpDir.path, config.workspace || ""))
  } else {
    throw new UserError(`unknown 'systemTmp' setting: ${config.systemTmp}`)
  }
}
