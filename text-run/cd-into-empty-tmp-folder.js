// @flow

import type { ActionArgs } from '../src/runners/action-args.js'

const fs = require('fs')
const os = require('os')
const path = require('path')
const uuid = require('uuid/v4')
const debug = require('debug')('text-runner:cd-into-empty-tmp-folder')

module.exports = async function (args: ActionArgs) {
  const existingDir = process.cwd()
  debug('remembering existing dir: ' + existingDir)
  global.cdHistory = existingDir
  const newFolder = path.join(os.tmpdir(), uuid())
  fs.mkdirSync(newFolder)
  args.formatter.log('cd ' + newFolder)
  process.chdir(newFolder)
}
