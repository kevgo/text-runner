import slugify from "@sindresorhus/slugify"

import { Action, FunctionRepo } from "./index.js"

export class Actions {
  list: FunctionRepo

  constructor() {
    this.list = {}
  }

  get(name: string): Action | undefined {
    return this.list[name]
  }

  /** provides the names of all registered actions */
  names(): string[] {
    return Object.keys(this.list).sort()
  }

  register(fileBasedName: string, action: any): void {
    if (typeof action === "function") {
      this.list[fileBasedName] = action
    } else if (typeof action.default === "function") {
      this.list[fileBasedName] = action.default
    } else if (typeof action === "object") {
      for (const key of Object.keys(action as Record<string, Action>)) {
        if (typeof key !== "string") {
          throw new Error(`Key "${key}" has unexpected type "${typeof key}", expected string`)
        }
        this.list[slugify(key)] = action[key]
      }
    } else {
      throw new Error(`Cannot use object of type "${typeof action}" as an exported action: ${action}`)
    }
  }

  size(): number {
    return Object.keys(this.list).length
  }
}
