import * as slugify from "@sindresorhus/slugify"

import { UserError } from "../errors/user-error"
import * as files from "../filesystem/index"

export function normalizeActionName(actionName: string, location: files.Location): string {
  const parts = actionName.split("/")
  if (parts.length === 1) {
    return slugify(actionName)
  }
  if (parts.length > 2) {
    throw new UserError(`Illegal activity name: "${actionName}" contains ${parts.length} slashes`, "", location)
  }
  return parts[0] + "/" + slugify(parts[1])
}
