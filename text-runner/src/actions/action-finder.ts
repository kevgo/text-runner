import * as color from "colorette"
import * as glob from "glob"
import * as interpret from "interpret"
import * as path from "path"
import * as rechoir from "rechoir"
import { Activity } from "../activity-list/types/activity"
import { UserError } from "../errors/user-error"
import { actionName } from "./helpers/action-name"
import { javascriptExtensions } from "./helpers/javascript-extensions"
import { trimExtension } from "./helpers/trim-extension"
import { Action } from "./types/action"
import { ExternalActionManager } from "./external-action-manager"
import { Actions } from "./actions"

/** ActionFinder provides runnable action instances for activities. */
export class ActionFinder {
  private readonly builtinActions: Actions
  private readonly customActions: Actions
  private readonly externalActions: ExternalActionManager

  constructor(builtIn: Actions, custom: Actions, external: ExternalActionManager) {
    this.builtinActions = builtIn
    this.customActions = custom
    this.externalActions = external
  }

  /** loads all actions */
  static load(sourceDir: string) {
    return new ActionFinder(
      loadBuiltinActions(),
      loadCustomActions(path.join(sourceDir, "text-run")),
      new ExternalActionManager()
    )
  }

  /** loads only the actions for dynamic tests */
  static loadDynamic(sourceDir: string) {
    return new ActionFinder(
      new Actions(),
      loadCustomActions(path.join(sourceDir, "text-run")),
      new ExternalActionManager()
    )
  }

  /** loads only the actions for static tests */
  static loadStatic() {
    return new ActionFinder(loadBuiltinActions(), new Actions(), new ExternalActionManager())
  }

  /** actionFor provides the action function for the given Activity. */
  actionFor(activity: Activity): Action {
    return (
      this.builtinActions.get(activity.actionName) ||
      this.customActions.get(activity.actionName) ||
      this.externalActions.get(activity.actionName) ||
      this.errorUnknownAction(activity)
    )
  }

  /** customActionNames returns the names of all built-in actions. */
  customActionNames(): string[] {
    return this.customActions.names()
  }

  /** errorUnknownAction signals that the given activity has no known action. */
  private errorUnknownAction(activity: Activity): never {
    let errorText = `unknown action: ${color.red(activity.actionName)}\n`
    if (this.customActions.size() > 0) {
      errorText += "\nUser-defined actions:\n"
      for (const actionName of this.customActions.names()) {
        errorText += `* ${actionName}\n`
      }
    } else {
      errorText += "\nNo custom actions defined.\n"
    }
    errorText += `\nTo create a new "${activity.actionName}" action,\n`
    errorText += `run "text-run scaffold ${activity.actionName}"\n`
    throw new UserError(errorText, activity.file.platformified(), activity.line)
  }
}

export function builtinActionFilePaths(): string[] {
  return glob.glob
    .sync(path.join(__dirname, "..", "actions", "built-in", "*.?s"))
    .filter((name) => !name.endsWith(".d.ts"))
    .map(trimExtension)
}

export function loadBuiltinActions(): Actions {
  const result = new Actions()
  for (const filename of builtinActionFilePaths()) {
    result.register(actionName(filename), require(filename))
  }
  return result
}

export function customActionFilePaths(dir: string): string[] {
  const pattern = path.join(dir, `*.@(${javascriptExtensions().join("|")})`)
  return glob.sync(pattern)
}

export function loadCustomActions(dir: string): Actions {
  const result = new Actions()
  for (const filename of customActionFilePaths(dir)) {
    rechoir.prepare(interpret.jsVariants, filename)
    result.register(actionName(filename), require(filename))
  }
  return result
}
