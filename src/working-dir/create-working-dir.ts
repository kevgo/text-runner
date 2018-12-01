import deb from 'debug'
import mkdirp from 'mkdirp'
import path from 'path'
import tmp from 'tmp'
import UnprintedUserError from '../errors/unprinted-user-error'

const debug = deb('text-runner:working-dir')

type workingDirSetting = string | boolean

// Creates the temp directory to run the tests in
export default function createWorkingDir(configSetting: workingDirSetting) {
  const workingDir = getWorkingDirPath(configSetting)
  debug(`using test directory: ${workingDir}`)
  mkdirp.sync(workingDir)
  return workingDir
}

function getWorkingDirPath(setting): string {
  if (typeof setting === 'string') {
    return setting
  } else if (setting === false) {
    return path.join(process.cwd(), 'tmp')
  } else if (setting === true) {
    return tmp.dirSync().name
  } else {
    throw new UnprintedUserError(
      `unknown 'useSystemTempDirectory' setting: ${setting}`
    )
  }
}
