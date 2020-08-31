import * as slugify from "@sindresorhus/slugify"
import { UserError } from "../errors/user-error"

export function normalizeActionName(actionName: string): string {
  const parts = actionName.split("/")
  if (parts.length === 1) {
    return slugify(actionName)
  }
  if (parts.length > 2) {
    throw new UserError(`Illegal activity name: "${actionName}" contains ${parts.length} slashes`)
  }
  return parts[0] + "/" + slugify(parts[1])
}
