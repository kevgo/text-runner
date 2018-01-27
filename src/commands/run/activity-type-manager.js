// @flow

import type {HandlerFunction} from './handler-function.js'
import type Configuration from '../../configuration/configuration.js'
import type Formatter from '../../formatters/formatter.js'

const camelcase = require('camelcase')
const {red} = require('chalk')
const glob = require('glob')
const interpret = require('interpret')
const path = require('path')
const rechoir = require('rechoir')
const UnprintedUserError = require('../../errors/unprinted-user-error.js')

class ActivityTypeManager {
  // Loads and provides built-in and custom handler functions

  formatter: Formatter
  configuration: Configuration
  handlerFunctions: { [string]: HandlerFunction }

  constructor (formatter: Formatter, configuration: Configuration) {
    this.formatter = formatter
    this.configuration = configuration
    this.handlerFunctions = {}
    this.loadBuiltinActions()
    this.loadCustomActions()
  }

  // Provides the action for the block with the given name
  handlerFunctionFor (activityType: string, filePath: string): HandlerFunction {
    const result = this.handlerFunctions[activityType.toLowerCase()]
    if (!result) {
      var errorText = `unknown activity type: ${red(activityType)}\nAvailable activity types:\n`
      for (let actionName of Object.keys(this.handlerFunctions).sort()) {
        errorText += `* ${actionName}\n`
      }
      errorText += `\nTo create a new "${activityType}" activity type,\n`
      errorText += `run "text-run add ${activityType}\n"`
      this.formatter.startFile(filePath)
      throw new UnprintedUserError(errorText)
    }
    return result
  }

  // Returns all possible filename extensions that handler functions can have
  javascriptExtensions (): string[] {
    return Object.keys(interpret.jsVariants).map((it) => it.slice(1))
  }

  builtinActionFilenames (): string[] {
    return glob.sync(path.join(__dirname, '..', '..', 'activity-types', '*.js'))
  }

  customActionFilenames (): string[] {
    const pattern = path.join(process.cwd(), 'text-run', `*.@(${this.javascriptExtensions().join('|')})`)
    return glob.sync(pattern)
  }

  loadBuiltinActions () {
    for (let filename of this.builtinActionFilenames()) {
      const actionName = camelcase(path.basename(filename, path.extname(filename))).replace(/Action/, '')
      this.handlerFunctions[actionName.toLowerCase()] = require(filename)
    }
  }

  loadCustomActions () {
    for (let filename of this.customActionFilenames()) {
      rechoir.prepare(interpret.jsVariants, filename)
      const actionName = camelcase(path.basename(filename, path.extname(filename))).replace(/Action/, '')
      this.handlerFunctions[actionName.toLowerCase()] = require(filename)
    }
  }
}

module.exports = ActivityTypeManager
