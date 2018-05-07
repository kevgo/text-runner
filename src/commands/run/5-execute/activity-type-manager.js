// @flow

import type { Activity } from '../4-activities/activity.js'
import type { HandlerFunction } from '../5-execute/handler-function.js'

const getActionName = require('../../../helpers/action-name.js')
const { red } = require('chalk')
const rechoir = require('rechoir')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

class ActivityTypeManager {
  // Loads and provides built-in and custom handler functions

  handlerFunctions: { [string]: HandlerFunction }

  constructor () {
    this.handlerFunctions = {}
    this.loadBuiltinActions()
    this.loadCustomActions()
  }

  // Provides the action for the block with the given name
  handlerFunctionFor (activity: Activity): HandlerFunction {
    const result = this.handlerFunctions[activity.type]
    if (!result) this.errorUnknownActivityType(activity)
    return result
  }

  errorUnknownActivityType (activity: Activity) {
    var errorText = `unknown activity type: ${red(
      activity.type
    )}\nAvailable activity types:\n`
    for (let actionName of Object.keys(this.handlerFunctions).sort()) {
      errorText += `* ${actionName}\n`
    }
    errorText += `\nTo create a new "${activity.type}" activity type,\n`
    errorText += `run "text-run add ${activity.type}"\n`
    throw new UnprintedUserError(errorText, activity.file, activity.line)
  }

  loadBuiltinActions () {
    for (let filename of this.builtinActionFilenames()) {
      this.handlerFunctions[getActionName(filename)] = require(filename)
    }
  }

  loadCustomActions () {
    for (let filename of this.customActionFilenames()) {
      rechoir.prepare(interpret.jsVariants, filename)
      const actionName = getActionName(filename)
      if (this.handlerFunctions[actionName]) {
        throw new UnprintedUserError(
          `redefining internal action '${actionName}'`,
          filename,
          1
        )
      }

      this.handlerFunctions[actionName] = require(filename)
    }
  }
}

module.exports = ActivityTypeManager
