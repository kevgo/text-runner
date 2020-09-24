import { Action, FunctionRepo } from "./index"
import * as actions from "../actions"
import { UserError } from "../errors/user-error"
import { Activity } from "../activities/index"

/** ExternalActionManager provides external actions from their own NPM modules */
export class ExternalActionManager {
  actions: FunctionRepo

  constructor() {
    this.actions = {}
  }

  /** provides the external action with the given name */
  get(activity: Activity): Action | null {
    const parts = activity.actionName.split("/")
    if (parts.length === 1) {
      // not an external action here --> ignore
      return null
    }
    if (parts.length > 2) {
      throw new UserError(
        `Too many slashes in action name "${activity.actionName}"`,
        "Activities are only allowed to have one slash in them: to separate the npm module name from the action name",
        activity.file,
        activity.line
      )
    }
    const moduleName = "textrun-" + parts[0]
    const wantAction = actions.name(parts[1])
    let module
    try {
      module = require(moduleName)
    } catch (e) {
      throw new UserError(`NPM package "${moduleName}" not found`, "", activity.file, activity.line)
    }
    const moduleActions = module.textrunActions
    if (!moduleActions) {
      throw new UserError(
        `NPM package "${moduleName}" does not contain any Text-Runner actions`,
        "",
        activity.file,
        activity.line
      )
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
      `NPM package "${moduleName}" does not contain action "${wantAction}"`,
      `Found actions: ${names.join(", ")}`,
      activity.file,
      activity.line
    )
  }
}
