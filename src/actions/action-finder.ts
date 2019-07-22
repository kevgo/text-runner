import color from "colorette"
import glob from "glob"
import interpret from "interpret"
import path from "path"
import rechoir from "rechoir"
import { Activity } from "../activity-list/activity"
import { UnprintedUserError } from "../errors/unprinted-user-error"
import { Action } from "./action"
import { getActionName } from "./helpers/get-action-name"
import { javascriptExtensions } from "./helpers/javascript-extensions"
import { trimExtension } from "./helpers/trim-extension"

interface FunctionRepo {
  [key: string]: Action
}

// ActionRepo provides runnable action instances for activities.
class ActionFinder {
  private builtinActions: FunctionRepo
  private customActions: FunctionRepo

  constructor() {
    this.builtinActions = this.loadBuiltinActions()
    this.customActions = this.loadCustomActions()
  }

  // Provides the action for the given Activity
  actionFor(activity: Activity): Action {
    return (
      this.builtinActions[activity.actionName] ||
      this.customActions[activity.actionName] ||
      this.errorUnknownAction(activity)
    )
  }

  // Returns the names of all built-in actions
  customActionNames(): string[] {
    return Object.keys(this.customActions)
  }

  // Note: need to define the return type as Action to satisfy the type checker
  //       who doesn't understand that this is an error check
  private errorUnknownAction(activity: Activity): Action {
    let errorText = `unknown action: ${color.red(
      activity.actionName
    )}\nAvailable built-in actions:\n`
    for (const actionName of Object.keys(this.builtinActions).sort()) {
      errorText += `* ${actionName}\n`
    }
    if (Object.keys(this.customActions).length > 0) {
      errorText += "\nUser-defined actions:\n"
      for (const actionName of Object.keys(this.customActions).sort()) {
        errorText += `* ${actionName}\n`
      }
    } else {
      errorText += "\nNo custom actions defined.\n"
    }
    errorText += `\nTo create a new "${activity.actionName}" action,\n`
    errorText += `run "text-run add ${activity.actionName}"\n`
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
    require("babel-register")
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
      .sync(path.join(__dirname, "..", "actions", "built-in", "*.?s"))
      .filter(name => !name.endsWith(".d.ts"))
      .map(trimExtension)
  }

  private customActionFilePaths(): string[] {
    const pattern = path.join(
      process.cwd(),
      "text-run",
      `*.@(${javascriptExtensions().join("|")})`
    )
    return glob.sync(pattern)
  }
}

export const actionFinder = new ActionFinder()
