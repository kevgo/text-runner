import { Action } from "./types/action"
import * as helpers from "../helpers"
import { FunctionRepo } from "./types/function-repo"
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
    const wantAction = helpers.actionName(parts[1])
    let module
    try {
      module = require(moduleName)
    } catch (e) {
      throw new UserError(`NPM package "${moduleName}" not found`, "", activity.file, activity.line)
    }
    const actions = module.textrunActions
    if (!actions) {
      throw new UserError(
        `NPM package "${moduleName}" does not contain any Text-Runner actions`,
        "",
        activity.file,
        activity.line
      )
    }
    const names = []
    for (const [rawName, action] of Object.entries(actions)) {
      const name = helpers.actionName(rawName)
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
