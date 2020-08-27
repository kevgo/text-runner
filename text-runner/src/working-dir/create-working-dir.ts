import * as fs from "fs-extra"
import * as path from "path"
import * as tmp from "tmp-promise"
import { UnprintedUserError } from "../errors/unprinted-user-error"

type workingDirSetting = string | boolean

/**
 * Creates the temp directory to run the tests in
 * @param configSetting TRUE: use system temp dir, FALSE: use local tmp dir, STRING: use given temp dir
 */
export async function createWorkspace(configSetting: workingDirSetting): Promise<string> {
  const workspacePath = await getWorkspacePath(configSetting)
  await fs.ensureDir(workspacePath)
  return workspacePath
}

async function getWorkspacePath(setting: workingDirSetting): Promise<string> {
  if (typeof setting === "string") {
    return setting
  } else if (setting === false) {
    return path.join(process.cwd(), "tmp")
  } else if (setting === true) {
    const tmpDir = await tmp.dir()
    return tmpDir.path
  } else {
    throw new UnprintedUserError(`unknown 'useSystemTempDirectory' setting: ${setting}`)
  }
}
