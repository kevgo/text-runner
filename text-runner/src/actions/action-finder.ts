import color from "colorette"
import glob from "glob"
import * as interpret from "interpret"
import path from "path"
import rechoir from "rechoir"
import { Activity } from "../activity-list/types/activity"
import { UnprintedUserError } from "../errors/unprinted-user-error"
import { actionName } from "./helpers/action-name"
import { javascriptExtensions } from "./helpers/javascript-extensions"
import { trimExtension } from "./helpers/trim-extension"
import { Action } from "./types/action"
import { ExternalActionManager } from "./external-action-manager"

export interface FunctionRepo {
  [key: string]: Action
}

/** ActionFinder provides runnable action instances for activities. */
export class ActionFinder {
  private readonly builtinActions: FunctionRepo
  private readonly customActions: FunctionRepo
  private readonly externalActions: ExternalActionManager

  constructor(sourceDir: string) {
    this.builtinActions = this.loadBuiltinActions()
    this.customActions = loadCustomActions(path.join(sourceDir, "text-run"))
    this.externalActions = new ExternalActionManager()
  }

  /** actionFor provides the action function for the given Activity. */
  actionFor(activity: Activity): Action {
    return (
      this.builtinActions[activity.actionName] ||
      this.customActions[activity.actionName] ||
      this.externalActions.actionFor(activity.actionName) ||
      this.errorUnknownAction(activity)
    )
  }

  /** customActionNames returns the names of all built-in actions. */
  customActionNames(): string[] {
    return Object.keys(this.customActions)
  }

  /** errorUnknownAction signals that the given activity has no known action. */
  private errorUnknownAction(activity: Activity): never {
    let errorText = `unknown action: ${color.red(activity.actionName)}\nAvailable built-in actions:\n`
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
    errorText += `run "text-run scaffold ${activity.actionName}"\n`
    throw new UnprintedUserError(errorText, activity.file.platformified(), activity.line)
  }

  private loadBuiltinActions(): FunctionRepo {
    const result: FunctionRepo = {}
    for (const filename of this.builtinActionFilePaths()) {
      result[actionName(filename)] = require(filename).default as Action
    }
    return result
  }

  private builtinActionFilePaths(): string[] {
    return glob
      .sync(path.join(__dirname, "..", "actions", "built-in", "*.?s"))
      .filter((name) => !name.endsWith(".d.ts"))
      .map(trimExtension)
  }
}

export function customActionFilePaths(dir: string): string[] {
  const pattern = path.join(dir, `*.@(${javascriptExtensions().join("|")})`)
  return glob.sync(pattern)
}

export function loadCustomActions(dir: string): FunctionRepo {
  const result: FunctionRepo = {}
  for (const filename of customActionFilePaths(dir)) {
    rechoir.prepare(interpret.jsVariants, filename)
    const standardName = actionName(filename)
    const action = require(filename)
    if (action.default) {
      result[standardName] = action.default
    } else {
      result[standardName] = action
    }
  }
  return result
}
