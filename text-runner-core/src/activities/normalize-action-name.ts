import * as slugify from "@sindresorhus/slugify"

import { UserError } from "../errors/user-error"
import { AbsoluteFilePath } from "../filesystem/absolute-file-path"

export function normalizeActionName(actionName: string, file: AbsoluteFilePath, line: number): string {
  const parts = actionName.split("/")
  if (parts.length === 1) {
    return slugify(actionName)
  }
  if (parts.length > 2) {
    throw new UserError(`Illegal activity name: "${actionName}" contains ${parts.length} slashes`, "", file, line)
  }
  return parts[0] + "/" + slugify(parts[1])
}
