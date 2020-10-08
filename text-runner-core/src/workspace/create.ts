import * as fs from "fs-extra"
import * as path from "path"
import * as tmp from "tmp-promise"

import * as configuration from "../configuration/index"
import { UserError } from "../errors/user-error"
import * as files from "../filesystem"

/** creates the temp directory to run the tests in */
export async function create(config: configuration.Data): Promise<files.FullDir> {
  const workspacePath = await getPath(config)
  if (config.emptyWorkspace) {
    await fs.emptyDir(workspacePath)
  }
  return workspacePath
}

async function getPath(config: configuration.Data): Promise<files.FullDir> {
  if (config.systemTmp === false) {
    return path.join(config.sourceDir, config.workspace.platformified())
  } else if (config.systemTmp === true) {
    const tmpDir = await tmp.dir()
    return path.join(tmpDir.path, config.workspace.platformified())
  } else {
    throw new UserError(`unknown 'systemTmp' setting: ${config.systemTmp}`)
  }
}
