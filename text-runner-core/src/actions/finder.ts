import { promises as fs } from "fs"
import path from "path"
import * as url from "url"

import * as actions from "../actions/index.js"
import * as activities from "../activities/index.js"
import { UserError } from "../errors/user-error.js"
import * as files from "../filesystem/index.js"
import { Actions } from "./actions.js"
import { ExternalActionManager } from "./external-action-manager.js"
import { Action } from "./index.js"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

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
      await loadCustomActions(sourceDir.joinStr("text-runner")),
      new ExternalActionManager()
    )
  }

  /** loads only the actions for dynamic tests */
  static async loadDynamic(sourceDir: files.SourceDir): Promise<Finder> {
    return new Finder(
      new Actions(),
      await loadCustomActions(sourceDir.joinStr("text-runner")),
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
    guidance += `run "text-runner scaffold ${activity.actionName}"\n`
    throw new UserError(errorText, guidance, activity.location)
  }
}

export async function builtinActionFilePaths(): Promise<string[]> {
  const result = []
  const builtinDir = path.join(__dirname, "built-in")
  for (const file of await fs.readdir(builtinDir)) {
    if (file.endsWith(".js") || (file.endsWith(".ts") && !file.endsWith(".d.ts"))) {
      result.push(path.join(builtinDir, file))
    }
  }
  return result
}

export async function loadBuiltinActions(): Promise<Actions> {
  const result = new Actions()
  for (const filename of await builtinActionFilePaths()) {
    const fileURL = url.pathToFileURL(filename)
    result.register(actions.name(filename), await import(fileURL.href))
  }
  return result
}

export async function customActionFilePaths(dir: string): Promise<string[]> {
  try {
    var files = await fs.readdir(dir)
  } catch (e) {
    // it's okay if there is no dir with custom actions
    return []
  }
  const result = []
  for (const file of files) {
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      result.push(path.join(dir, file))
    }
  }
  return result
}

export async function loadCustomActions(dir: string): Promise<Actions> {
  const result = new Actions()
  for (const filename of await customActionFilePaths(dir)) {
    const fileURL = url.pathToFileURL(filename)
    result.register(actions.name(filename), await import(fileURL.href))
  }
  return result
}
