import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "../types/action-args"

/**
 * The "verifyWorkspaceContainsDirectory" action verifies that the test workspace
 * contains the given directory.
 */
export default async function verifyWorkspaceContainsDirectory(action: ActionArgs) {
  const directory = action.nodes.text()
  const fullPath = path.join(action.configuration.workspace, directory)
  action.name(`verifying the ${color.bold(color.cyan(directory))} directory exists in the test workspace`)
  action.log(`ls ${fullPath}`)
  let stats: fs.Stats
  try {
    stats = await fs.lstat(fullPath)
  } catch (err) {
    throw new Error(`directory ${color.cyan(color.bold(directory))} does not exist in the test workspace`)
  }
  if (!stats.isDirectory()) {
    throw new Error(`${color.cyan(color.bold(directory))} exists but is not a directory`)
  }
}
