// @flow

import type { Activity } from '../activity-list/activity.js'
import type { Action } from '../runners/action.js'

const builtinActionFilePaths = require('../helpers/builtin-action-filepaths.js')
const customActionFilePaths = require('../helpers/custom-action-filepaths.js')
const getActionName = require('../helpers/action-name.js')
const interpret = require('interpret')
const { red } = require('chalk')
const rechoir = require('rechoir')
const UnprintedUserError = require('../errors/unprinted-user-error.js')

type FunctionRepo = { [string]: Action }

const builtinActions = loadBuiltinActions()
const customActions = loadCustomActions()

// Provides the action for the block with the given name
function actionFor (activity: Activity): Action {
  return (
    builtinActions[activity.type] ||
    customActions[activity.type] ||
    errorUnknownActivityType(activity)
  )
}

function errorUnknownActivityType (activity: Activity) {
  var errorText = `unknown activity type: ${red(
    activity.type
  )}\nAvailable built-in activity types:\n`
  for (let actionName of Object.keys(builtinActions).sort()) {
    errorText += `* ${actionName}\n`
  }
  if (Object.keys(customActions).length > 0) {
    errorText += '\nYou defined these custom activity types:\n'
    for (let actionName of Object.keys(customActions).sort()) {
      errorText += `* ${actionName}\n`
    }
  } else {
    errorText += '\nNo custom actions defined.\n'
  }
  errorText += `\nTo create a new "${activity.type}" activity type,\n`
  errorText += `run "text-run add ${activity.type}"\n`
  throw new UnprintedUserError(errorText, activity.file, activity.line)
}

function loadBuiltinActions (): FunctionRepo {
  const result = {}
  for (const filename of builtinActionFilePaths()) {
    result[getActionName(filename)] = require(filename)
  }
  return result
}

function loadCustomActions (): FunctionRepo {
  const result = {}
  require('babel-register')
  for (const filename of customActionFilePaths()) {
    rechoir.prepare(interpret.jsVariants, filename)
    const actionName = getActionName(filename)
    if (builtinActions[actionName]) {
      throw new UnprintedUserError(
        `redefining internal action '${actionName}'`,
        filename,
        1
      )
    }
    result[actionName] = require(filename)
  }
  return result
}

module.exports = actionFor
