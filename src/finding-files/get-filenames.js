// @flow

import type { Configuration } from '../configuration/configuration.js'

const allMarkdownFiles = require('./all-markdown-files.js')
const debug = require('debug')('text-runner:run-command')
const filesMatchingGlob = require('../helpers/files-matching-glob.js')
const hasDirectory = require('../helpers/has-directory.js')
const isGlob = require('is-glob')
const isMarkdownFile = require('./is-markdown-file.js')
const markdownFilesInDir = require('./markdown-files-in-dir.js')
const { red } = require('chalk')
const removeExcludedFiles = require('./remove-excluded-files.js')
const UnprintedUserError = require('../errors/unprinted-user-error.js')

// Returns the name of all files/directories that match the given glob
module.exports = function (config: Configuration): string[] {
  var filenames = getFiles(config)
  filenames = removeExcludedFiles(filenames, config.exclude)
  debugFilenames(filenames)
  return filenames
}

function getFiles (config: Configuration): string[] {
  if (config.fileGlob === '') {
    return allMarkdownFiles(config.fileGlob)
  } else if (hasDirectory(config.fileGlob)) {
    return markdownFilesInDir(config.fileGlob)
  } else if (isMarkdownFile(config.fileGlob)) {
    return [config.fileGlob]
  } else if (isGlob(config.fileGlob)) {
    return filesMatchingGlob(config.fileGlob)
  } else {
    throw new UnprintedUserError(
      `file or directory does not exist: ${red(config.fileGlob)}`
    )
  }
}

function debugFilenames (filenames: string[]) {
  debug('testing files:')
  for (let filename of filenames) {
    debug(`  * ${filename}`)
  }
}
