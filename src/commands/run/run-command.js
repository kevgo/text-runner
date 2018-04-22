// @flow

import type { Command } from '../command.js'
import type Configuration from '../../configuration/configuration.js'
import type Formatter from '../../formatters/formatter.js'
import type { LinkTargetList } from './link-target-list.js'

const ActivityTypeManager = require('./activity-type-manager.js')
const { red } = require('chalk')
const fs = require('fs')
const glob = require('glob')
const isGlob = require('is-glob')
const MarkdownFileRunner = require('./markdown-file-runner')
const path = require('path')
const debug = require('debug')('text-runner:run-command')
const UnprintedUserError = require('../../errors/unprinted-user-error.js')

module.exports = async function runCommand ( configuration: Configuration, formatter: Formatter, activityTypesManager: ActivityTypeManager, glob: string) {
  const workingDir = createWorkingDir(configuration.get('useSystemTempDirectory'))
  var filenames = getFileNames(glob)
  filenames = removeExcludedFiles(filenames)
  debugFilenames(filenames)


  await prepareRunners()
  await executeRunners()

}

function debugFilenames(filenames: string[]) {
  debug('testing files:')
  for (let filename of filenames) {
    debug(`  * ${filename}`)
  }
}

// getFileNames returns the name of all files/directories that match the given glob
function getFileNames(glob:string): string[] {
  if (hasDirectory(filename)) {
    return markdownFilesInDir(dirname)
  } else if (isMarkdownFile(filename)) {
    return [filename]
  } else if (isGlob(filename)) {
    return filesMatchingGlob(fileExpression)
  } else if (filename) {
    throw new UnprintedUserError(
      `file or directory does not exist: ${red(filename)}`
    )
  } else {
    return allMarkdownFiles()
  }
}


_filesMatchingGlob (expression: string): string[] {
  return glob.sync(expression).sort()
}

_removeExcludedFiles (files: string[]): string[] {
  var excludedFiles = this.configuration.get('exclude')
  if (!excludedFiles) return files
  var excludedFilesArray = []
  if (Array.isArray(excludedFiles)) {
    excludedFilesArray = excludedFiles
  } else {
    excludedFilesArray = [excludedFiles]
  }
  return files.filter(file => {
    for (let excludedFile of excludedFilesArray) {
      const regex = new RegExp(excludedFile)
      return !regex.test(file)
    }
  })
}

// Returns all the markdown files in this directory and its children
_markdownFilesInDir (dirName) {
  const files = glob.sync(`${dirName}/**/*.md`)
  if (files.length === 0) {
    this.formatter.warning('no Markdown files found')
  }
  return files.filter(file => !file.includes('node_modules')).sort()
}

// Returns all the markdown files in the current working directory
_allMarkdownFiles () {
  var files = glob.sync(this.configuration.get('files'))
  if (files.length === 0) {
    this.formatter.warning('no Markdown files found')
  }
  files = files.filter(file => !file.includes('node_modules')).sort()
  // if (this.filename != null) {
  //   files = files.filter(file => !file === this.filename)
  // }
  return files
}

async _executeRunners (): Promise<void> {
  for (let runner of this.runners) {
    await runner.run()
  }
  this.formatter.suiteSuccess()
}

async _prepareRunners () {
  for (let runner of this.runners) {
    await runner.prepare()
  }
}
}

// TODO: extract into helper dir
function hasDirectory (dirname: string): boolean {
try {
  return fs.statSync(dirname).isDirectory()
} catch (e) {
  return false
}
}

function isMarkdownFile (filename: string): boolean {
try {
  const filepath = path.join(process.cwd(), filename)
  return filename.endsWith('.md') && fs.statSync(filepath).isFile()
} catch (e) {
  return false
}
}

module.exports = RunCommand
