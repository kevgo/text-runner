import deb from 'debug'
import mkdirp from 'mkdirp'
import path from 'path'
import tmp from 'tmp-promise'
import { UnprintedUserError } from '../errors/unprinted-user-error'

const debug = deb('text-runner:working-dir')

type workingDirSetting = string | boolean

// Creates the temp directory to run the tests in
export default async function createWorkingDir(
  configSetting: workingDirSetting
) {
  const workingDir = await getWorkingDirPath(configSetting)
  debug(`using test directory: ${workingDir}`)
  await mkdirp(workingDir)
  return workingDir
}

async function getWorkingDirPath(setting): Promise<string> {
  if (typeof setting === 'string') {
    return setting
  } else if (setting === false) {
    return path.join(process.cwd(), 'tmp')
  } else if (setting === true) {
    const tmpDir = await tmp.dir()
    return tmpDir.path
  } else {
    throw new UnprintedUserError(
      `unknown 'useSystemTempDirectory' setting: ${setting}`
    )
  }
}
