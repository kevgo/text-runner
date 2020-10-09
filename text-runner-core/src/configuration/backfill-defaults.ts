import * as path from "path"
import * as tmp from "tmp-promise"

import { UserError } from "../errors/user-error"
import { Data, PartialData } from "./data"
import { defaults } from "./defaults"

export async function backfillDefaults(partial: PartialData): Promise<Data> {
  const result = defaults()
  for (const [key, value] of Object.entries(partial)) {
    if (value != null) {
      // @ts-ignore
      result[key] = value
    }
  }
  result.workspace = await getWorkspacePath(result, partial.workspace || "tmp")
  return result
}

async function getWorkspacePath(config: Data, workspace: string): Promise<string> {
  if (config.systemTmp === false) {
    return path.join(config.sourceDir, workspace)
  } else if (config.systemTmp === true) {
    const tmpDir = await tmp.dir()
    return path.join(tmpDir.path, workspace)
  } else {
    throw new UserError(`unknown 'systemTmp' setting: ${config.systemTmp}`)
  }
}
