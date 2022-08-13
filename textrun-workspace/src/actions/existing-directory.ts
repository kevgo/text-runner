import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

/**
 * The "directory" action verifies that the test workspace
 * contains the given directory.
 */
export async function existingDirectory(action: tr.actions.Args): Promise<void> {
  const dirName = action.region.text()
  const dirRelName = path.join(action.region[0].attributes["dir"] || ".", dirName)
  action.name(`directory ${color.cyan(dirRelName)} exists in the workspace`)
  const fullPath = action.configuration.workspace.joinStr(dirRelName)
  try {
    var stats = await fs.lstat(fullPath)
  } catch (err) {
    throw new Error(`directory ${color.cyan(color.bold(dirRelName))} does not exist in the workspace`)
  }
  if (!stats.isDirectory()) {
    throw new Error(`${color.cyan(dirRelName)} exists but is not a directory`)
  }
}
