import { FunctionRepo } from "./action-finder"
import { Action } from "./types/action"
import { UnprintedUserError } from "../errors/unprinted-user-error"
/** manages external actions in separate NPM modules */
export class ExternalActionManager {
  actions: FunctionRepo

  constructor() {
    this.actions = {}
  }

  /** provides the external action with the given name */
  actionFor(fullActivity: string): Action | null {
    console.log(process.cwd())
    const parts = fullActivity.split("/")
    if (parts.length === 1) {
      // not an external action here --> ignore
      return null
    }
    const moduleName = "textrun-" + parts[0]
    const actionName = parts[1]
    let module
    try {
      module = require(moduleName)
    } catch (e) {
      throw new UnprintedUserError(`NPM package "${moduleName}" not found`)
    }
    const actions = module.textrunActions
    if (!actions) {
      throw new UnprintedUserError(`NPM package "${moduleName}" does not contain any Text-Runner actions`)
    }
    const action = actions[actionName]
    if (!action) {
      throw new UnprintedUserError(
        `NPM package "${moduleName}" does not contain action "${actionName}.
        Found actions [${Object.keys(actions).join(", ")}]`
      )
    }
    return action
  }
}
