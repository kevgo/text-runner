import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "text-runner/src/actions/types/action-args"

/**
 * The "directory" action verifies that the test workspace
 * contains the given directory.
 */
export async function directory(action: ActionArgs) {
  const directory = action.nodes.text()
  const fullPath = path.join(action.configuration.workspace, directory)
  action.name(`directory ${color.cyan(directory)} exists in the workspace`)
  let stats: fs.Stats
  try {
    stats = await fs.lstat(fullPath)
  } catch (err) {
    throw new Error(`directory ${color.cyan(color.bold(directory))} does not exist in the workspace`)
  }
  if (!stats.isDirectory()) {
    throw new Error(`${color.cyan(directory)} exists but is not a directory`)
  }
}
