import { Activity } from '../activity-list/activity'
import { Action } from './action'

import chalk from 'chalk'
import glob from 'glob'
import interpret from 'interpret'
import path from 'path'
import rechoir from 'rechoir'
import UnprintedUserError from '../errors/unprinted-user-error'
import getActionName from '../helpers/action-name'
import javascriptExtensions from '../helpers/javascript-extensions'
import trimExtension from '../helpers/trim-extension'

interface FunctionRepo {
  [key: string]: Action
}

class ActionRepo {
  private builtinActions: FunctionRepo
  private customActions: FunctionRepo

  constructor() {
    this.builtinActions = this.loadBuiltinActions()
    this.customActions = this.loadCustomActions()
  }

  // Provides the action for the block with the given name
  actionFor(activity: Activity): Action {
    return (
      this.builtinActions[activity.type] ||
      this.customActions[activity.type] ||
      this.errorUnknownActivityType(activity)
    )
  }

  // Note: need to define the return type as Action to satisfy the type checker
  //       who doesn't understand that this is an error check
  private errorUnknownActivityType(activity: Activity): Action {
    let errorText = `unknown activity type: ${chalk.red(
      activity.type
    )}\nAvailable built-in activity types:\n`
    for (const actionName of Object.keys(this.builtinActions).sort()) {
      errorText += `* ${actionName}\n`
    }
    if (Object.keys(this.customActions).length > 0) {
      errorText += '\nYou defined these custom activity types:\n'
      for (const actionName of Object.keys(this.customActions).sort()) {
        errorText += `* ${actionName}\n`
      }
    } else {
      errorText += '\nNo custom actions defined.\n'
    }
    errorText += `\nTo create a new "${activity.type}" activity type,\n`
    errorText += `run "text-run add ${activity.type}"\n`
    throw new UnprintedUserError(
      errorText,
      activity.file.platformified(),
      activity.line
    )
  }

  private loadBuiltinActions(): FunctionRepo {
    const result = {}
    for (const filename of this.builtinActionFilePaths()) {
      result[getActionName(filename)] = require(filename).default
    }
    return result
  }

  private loadCustomActions(): FunctionRepo {
    const result = {}
    require('babel-register')
    for (const filename of this.customActionFilePaths()) {
      rechoir.prepare(interpret.jsVariants, filename)
      const actionName = getActionName(filename)
      if (this.builtinActions[actionName]) {
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

  private builtinActionFilePaths(): string[] {
    return glob
      .sync(path.join(__dirname, '..', 'actions', '*.js'))
      .map(trimExtension)
  }

  private customActionFilePaths(): string[] {
    const pattern = path.join(
      process.cwd(),
      'text-run',
      `*.@(${javascriptExtensions().join('|')})`
    )
    return glob.sync(pattern)
  }
}

const actionRepo = new ActionRepo()
export default actionRepo
