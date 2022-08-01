import * as actions from "../actions"
import { Activity } from "../activities/index"
import { UserError } from "../errors/user-error"
import * as tr_export from "./export"
import { Action, FunctionRepo } from "./index"

/** ExternalActionManager provides external actions from their own NPM modules */
export class ExternalActionManager {
  actions: FunctionRepo

  constructor() {
    this.actions = {}
  }

  /** provides the external action with the given name */
  async get(activity: Activity): Promise<Action | null> {
    const parts = activity.actionName.split("/")
    if (parts.length === 1) {
      // not an external action here --> ignore
      return null
    }
    if (parts.length > 2) {
      throw new UserError(
        `Too many slashes in action name "${activity.actionName}"`,
        "Activities are only allowed to have one slash in them: to separate the npm module name from the action name",
        activity.location
      )
    }
    const moduleName = "textrun-" + parts[0]
    const wantAction = actions.name(parts[1])
    try {
      var module: tr_export.TextrunActions = await import(moduleName)
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e
      }
      throw new UserError(`cannot load npm package "${moduleName}"`, e.message, activity.location)
    }
    const moduleActions = module.textrunActions
    if (!moduleActions) {
      throw new UserError(`npm package "${moduleName}" does not contain any Text-Runner actions`, "", activity.location)
    }
    const names = []
    for (const [rawName, action] of Object.entries(moduleActions)) {
      const name = actions.name(rawName)
      if (name === wantAction) {
        return action as Action
      }
      names.push(name)
    }
    throw new UserError(
      `npm package "${moduleName}" does not contain action "${wantAction}"`,
      `Found actions: ${names.join(", ")}`,
      activity.location
    )
  }
}
