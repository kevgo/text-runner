// @flow

import type Configuration from '../../../configuration/configuration.js'

const allMarkdownFiles = require('./all-markdown-files.js')
const debug = require('debug')('text-runner:run-command')
const filesMatchingGlob = require('./files-matching-glob.js')
const hasDirectory = require('./has-directory.js')
const isGlob = require('is-glob')
const isMarkdownFile = require('./is-markdown-file.js')
const markdownFilesInDir = require('./markdown-files-in-dir.js')
const { red } = require('chalk')
const removeExcludedFiles = require('./remove-excluded-files.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

// Returns the name of all files/directories that match the given glob
module.exports = function (glob: ?string, config: Configuration): string[] {
  var filenames = getFiles(glob, config)
  filenames = removeExcludedFiles(filenames, config.get('exclude'))
  debugFilenames(filenames)
  return filenames
}

function getFiles (glob: ?string, config: Configuration): string[] {
  if (!glob) {
    return allMarkdownFiles(config.get('files'))
  } else if (hasDirectory(glob)) {
    return markdownFilesInDir(glob)
  } else if (isMarkdownFile(glob)) {
    return [glob]
  } else if (isGlob(glob)) {
    return filesMatchingGlob(glob)
  } else {
    throw new UnprintedUserError(
      `file or directory does not exist: ${red(glob)}`
    )
  }
}

function debugFilenames (filenames: string[]) {
  debug('testing files:')
  for (let filename of filenames) {
    debug(`  * ${filename}`)
  }
}
