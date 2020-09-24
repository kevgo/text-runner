import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

/**
 * The "directory" action verifies that the test workspace
 * contains the given directory.
 */
export async function existingDirectory(action: tr.actions.Args): Promise<void> {
  const directory = action.region.text()
  const fullPath = path.join(action.configuration.workspace, directory)
  action.name(`directory ${color.cyan(directory)} exists in the workspace`)
  let stats: any
  try {
    stats = await fs.lstat(fullPath)
  } catch (err) {
    throw new Error(`directory ${color.cyan(color.bold(directory))} does not exist in the workspace`)
  }
  if (!stats.isDirectory()) {
    throw new Error(`${color.cyan(directory)} exists but is not a directory`)
  }
}
