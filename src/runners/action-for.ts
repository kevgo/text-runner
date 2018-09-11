import { Activity } from "../activity-list/activity.js"
import { Action } from "../runners/action.js"

import chalk from "chalk"
import interpret from "interpret"
import rechoir from "rechoir"
import UnprintedUserError from "../errors/unprinted-user-error.js"
import getActionName from "../helpers/action-name.js"
import builtinActionFilePaths from "../helpers/builtin-action-filepaths.js"
import customActionFilePaths from "../helpers/custom-action-filepaths.js"

interface FunctionRepo {
  [key: string]: Action
}

const builtinActions = loadBuiltinActions()
const customActions = loadCustomActions()

// Provides the action for the block with the given name
export default function actionFor(activity: Activity): Action {
  return (
    builtinActions[activity.type] ||
    customActions[activity.type] ||
    errorUnknownActivityType(activity)
  )
}

// Note: need to define the return type as Action to satisfy the type checker
//       who doesn't understand that this is an error check
function errorUnknownActivityType(activity: Activity): Action {
  let errorText = `unknown activity type: ${chalk.red(
    activity.type
  )}\nAvailable built-in activity types:\n`
  for (const actionName of Object.keys(builtinActions).sort()) {
    errorText += `* ${actionName}\n`
  }
  if (Object.keys(customActions).length > 0) {
    errorText += "\nYou defined these custom activity types:\n"
    for (const actionName of Object.keys(customActions).sort()) {
      errorText += `* ${actionName}\n`
    }
  } else {
    errorText += "\nNo custom actions defined.\n"
  }
  errorText += `\nTo create a new "${activity.type}" activity type,\n`
  errorText += `run "text-run add ${activity.type}"\n`
  throw new UnprintedUserError(
    errorText,
    activity.file.platformified(),
    activity.line
  )
}

function loadBuiltinActions(): FunctionRepo {
  const result = {}
  for (const filename of builtinActionFilePaths()) {
    result[getActionName(filename)] = require(filename)
  }
  return result
}

function loadCustomActions(): FunctionRepo {
  const result = {}
  require("babel-register")
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
