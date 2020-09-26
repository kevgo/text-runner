import * as fs from "fs-extra"
import * as path from "path"
import * as tmp from "tmp-promise"
import { UserError } from "../errors/user-error"
import * as configuration from "../configuration/index"

/** creates the temp directory to run the tests in */
export async function create(config: configuration.Data): Promise<string> {
  const workspacePath = await getPath(config)
  if (config.emptyWorkspace) {
    await fs.emptyDir(workspacePath)
  }
  return workspacePath
}

async function getPath(config: configuration.Data): Promise<string> {
  if (config.systemTmp === false) {
    return path.join(config.sourceDir, config.workspace)
  } else if (config.systemTmp === true) {
    const tmpDir = await tmp.dir()
    return path.join(tmpDir.path, config.workspace)
  } else {
    throw new UserError(`unknown 'systemTmp' setting: ${config.systemTmp}`)
  }
}
