import * as fs from "fs-extra"
import * as path from "path"
import * as tmp from "tmp-promise"
import { UserError } from "../errors/user-error"
import { Configuration } from "../configuration/configuration"

/** creates the temp directory to run the tests in */
export async function createWorkspace(config: Configuration): Promise<string> {
  const workspacePath = await getWorkspacePath(config)
  await fs.emptyDir(workspacePath)
  return workspacePath
}

async function getWorkspacePath(config: Configuration): Promise<string> {
  if (typeof config.systemTmp === "string") {
    return config.systemTmp
  } else if (config.systemTmp === false) {
    return path.join(config.sourceDir, "tmp")
  } else if (config.systemTmp === true) {
    const tmpDir = await tmp.dir()
    return tmpDir.path
  } else {
    throw new UserError(`unknown 'systemTmp' setting: ${config.systemTmp}`)
  }
}
