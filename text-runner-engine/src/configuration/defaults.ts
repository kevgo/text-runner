import * as path from "path"
import * as tmp from "tmp-promise"

import { UserError } from "../errors/user-error.js"
import * as files from "../filesystem/index.js"
import * as configuration from "./index.js"
import { Publications } from "./publications.js"

export async function addDefaults(partial: configuration.APIData): Promise<configuration.Data> {
  const fullAPIData = defaults()
  for (const [key, value] of Object.entries(partial)) {
    if (value != null) {
      // @ts-expect-error TypeScript is too stupid to realize that `key` has the correct type here
      fullAPIData[key] = value
    }
  }
  return {
    ...fullAPIData,
    sourceDir: new files.SourceDir(fullAPIData.sourceDir),
    workspace: await getWorkspacePath(fullAPIData)
  }
}

/** provides the default configuration values to use when no values are provided via CLI or config file */
export function defaults(): configuration.CompleteAPIData {
  return {
    defaultFile: "",
    emptyWorkspace: true,
    exclude: [],
    files: "**/*.md",
    ignoreLinkTargets: [],
    online: false,
    publications: new Publications(),
    regionMarker: "type",
    scaffoldLanguage: "js",
    showSkipped: false,
    sourceDir: process.cwd(),
    systemTmp: false,
    workspace: "tmp"
  }
}

async function getWorkspacePath(config: configuration.CompleteAPIData): Promise<files.AbsoluteDirPath> {
  if (config.systemTmp === false) {
    return new files.AbsoluteDirPath(path.join(config.sourceDir, config.workspace || "") || "")
  } else if (config.systemTmp === true) {
    const tmpDir = await tmp.dir()
    return new files.AbsoluteDirPath(path.join(tmpDir.path, config.workspace || ""))
  } else {
    throw new UserError(
      `unknown 'systemTmp' setting: ${config.systemTmp}`,
      `Since version 5.0.0, the only valid settings for "systemTmp" are "true" and "false"`
    )
  }
}
