import * as glob from "glob"
import * as interpret from "interpret"
import * as path from "path"
import * as rechoir from "rechoir"

import * as actions from "../actions"
import * as activities from "../activities/index"
import { UserError } from "../errors/user-error"
import * as files from "../filesystem"
import * as helpers from "../helpers"
import { Actions } from "./actions"
import { ExternalActionManager } from "./external-action-manager"
import { Action } from "./index"

/** ActionFinder provides runnable action instances for activities. */
export class Finder {
  private readonly builtinActions: Actions
  private readonly customActions: Actions
  private readonly externalActions: ExternalActionManager

  constructor(builtIn: Actions, custom: Actions, external: ExternalActionManager) {
    this.builtinActions = builtIn
    this.customActions = custom
    this.externalActions = external
  }

  /** loads all actions */
  static load(sourceDir: files.SourceDir): Finder {
    return new Finder(
      loadBuiltinActions(),
      loadCustomActions(sourceDir.joinStr("text-run")),
      new ExternalActionManager()
    )
  }

  /** loads only the actions for dynamic tests */
  static loadDynamic(sourceDir: files.SourceDir): Finder {
    return new Finder(new Actions(), loadCustomActions(sourceDir.joinStr("text-run")), new ExternalActionManager())
  }

  /** loads only the actions for static tests */
  static loadStatic(): Finder {
    return new Finder(loadBuiltinActions(), new Actions(), new ExternalActionManager())
  }

  /** actionFor provides the action function for the given Activity. */
  actionFor(activity: activities.Activity): Action {
    return (
      this.builtinActions.get(activity.actionName) ||
      this.customActions.get(activity.actionName) ||
      this.externalActions.get(activity) ||
      this.errorUnknownAction(activity)
    )
  }

  /** customActionNames returns the names of all built-in actions. */
  customActionNames(): string[] {
    return this.customActions.names()
  }

  /** errorUnknownAction signals that the given activity has no known action. */
  private errorUnknownAction(activity: activities.Activity): never {
    const errorText = `unknown action: ${activity.actionName}`
    let guidance = ""
    if (this.customActions.size() > 0) {
      guidance += "User-defined actions:\n"
      for (const actionName of this.customActions.names()) {
        guidance += `* ${actionName}\n`
      }
    } else {
      guidance += "No custom actions defined.\n"
    }
    guidance += `\nTo create a new "${activity.actionName}" action,\n`
    guidance += `run "text-run scaffold ${activity.actionName}"\n`
    throw new UserError(errorText, guidance, activity.location)
  }
}

export function builtinActionFilePaths(): string[] {
  return glob.glob
    .sync(path.join(__dirname, "..", "actions", "built-in", "*.?s"))
    .filter(name => !name.endsWith(".d.ts"))
    .map(helpers.trimExtension)
}

export function loadBuiltinActions(): Actions {
  const result = new Actions()
  for (const filename of builtinActionFilePaths()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    result.register(actions.name(filename), require(filename))
  }
  return result
}

export function customActionFilePaths(dir: string): string[] {
  const pattern = path.join(dir, `*.@(${helpers.javascriptExtensions().join("|")})`)
  return glob.sync(pattern)
}

export function loadCustomActions(dir: string): Actions {
  const result = new Actions()
  for (const filename of customActionFilePaths(dir)) {
    rechoir.prepare(interpret.jsVariants, filename)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    result.register(actions.name(filename), require(filename))
  }
  return result
}
