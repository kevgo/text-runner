// @flow

const debug = require('debug')('text-runner:working-dir')
const mkdirp = require('mkdirp')
const path = require('path')
const tmp = require('tmp')
const UnprintedUserError = require('../errors/unprinted-user-error.js')

type workingDirSetting = string | boolean

// Creates the temp directory to run the tests in
module.exports = function createWorkingDir (configSetting: workingDirSetting) {
  const workingDir = getWorkingDirPath(configSetting)
  debug(`using test directory: ${workingDir}`)
  mkdirp.sync(workingDir)
  return workingDir
}

function getWorkingDirPath (setting): string {
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
