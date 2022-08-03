import * as glob from "glob"
import * as interpret from "interpret"
import * as path from "path"
import * as rechoir from "rechoir"

import * as actions from "../actions/index.js"
import * as activities from "../activities/index.js"
import { UserError } from "../errors/user-error.js"
import * as files from "../filesystem/index.js"
import * as helpers from "../helpers/index.js"
import { Actions } from "./actions.js"
import { ExternalActionManager } from "./external-action-manager.js"
import { Action } from "./index.js"

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
  static async load(sourceDir: files.SourceDir): Promise<Finder> {
    return new Finder(
      await loadBuiltinActions(),
      await loadCustomActions(sourceDir.joinStr("text-run")),
      new ExternalActionManager()
    )
  }

  /** loads only the actions for dynamic tests */
  static async loadDynamic(sourceDir: files.SourceDir): Promise<Finder> {
    return new Finder(
      new Actions(),
      await loadCustomActions(sourceDir.joinStr("text-run")),
      new ExternalActionManager()
    )
  }

  /** loads only the actions for static tests */
  static async loadStatic(): Promise<Finder> {
    return new Finder(await loadBuiltinActions(), new Actions(), new ExternalActionManager())
  }

  /** actionFor provides the action function for the given Activity. */
  async actionFor(activity: activities.Activity): Promise<Action> {
    return (
      this.builtinActions.get(activity.actionName) ||
      this.customActions.get(activity.actionName) ||
      (await this.externalActions.get(activity)) ||
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

export async function loadBuiltinActions(): Promise<Actions> {
  const result = new Actions()
  for (const filename of builtinActionFilePaths()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    result.register(actions.name(filename), await import(filename))
  }
  return result
}

export function customActionFilePaths(dir: string): string[] {
  const pattern = path.join(dir, `*.@(${helpers.javascriptExtensions().join("|")})`)
  return glob.sync(pattern)
}

export async function loadCustomActions(dir: string): Promise<Actions> {
  const result = new Actions()
  for (const filename of customActionFilePaths(dir)) {
    rechoir.prepare(interpret.jsVariants, filename)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    result.register(actions.name(filename), await import(filename))
  }
  return result
}
