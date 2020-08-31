import { Action } from "./types/action"
import { actionName } from "./helpers/action-name"
import { FunctionRepo } from "./types/function-repo"
import { UserError } from "../errors/user-error"

/** ExternalActionManager provides external actions from their own NPM modules */
export class ExternalActionManager {
  actions: FunctionRepo

  constructor() {
    this.actions = {}
  }

  /** provides the external action with the given name */
  get(fullActivity: string): Action | null {
    const parts = fullActivity.split("/")
    if (parts.length === 1) {
      // not an external action here --> ignore
      return null
    }
    if (parts.length > 2) {
      throw new UserError(`Too many slashes in action name "${fullActivity}"`)
    }
    const moduleName = "textrun-" + parts[0]
    const wantAction = actionName(parts[1])
    let module
    try {
      module = require(moduleName)
    } catch (e) {
      throw new UserError(`NPM package "${moduleName}" not found`)
    }
    const actions = module.textrunActions
    if (!actions) {
      throw new UserError(`NPM package "${moduleName}" does not contain any Text-Runner actions`)
    }
    const names = []
    for (const [rawName, action] of Object.entries(actions)) {
      const name = actionName(rawName)
      if (name === wantAction) {
        return action as Action
      }
      names.push(name)
    }
    throw new UserError(
      `NPM package "${moduleName}" does not contain action "${wantAction}"`,
      `Found actions: ${names.join(", ")}`
    )
  }
}
