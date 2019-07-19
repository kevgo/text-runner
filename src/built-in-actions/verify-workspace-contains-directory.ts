import color from "colorette"
import fs from "fs-extra"
import path from "path"
import { ActionArgs } from "../runners/action-args"

// Verifies that the test workspace contains the given directory
export default async function verifyWorkspaceContainsDirectory(
  args: ActionArgs
) {
  const directory = args.nodes.text()
  const fullPath = path.join(args.configuration.workspace, directory)
  args.formatter.name(
    `verifying the ${color.bold(
      color.cyan(directory)
    )} directory exists in the test workspace`
  )
  args.formatter.log(`ls ${fullPath}`)
  let stats
  try {
    stats = await fs.lstat(fullPath)
  } catch (err) {
    throw new Error(
      `directory ${color.cyan(
        color.bold(directory)
      )} does not exist in the test workspace`
    )
  }
  if (!stats.isDirectory()) {
    throw new Error(
      `${color.cyan(color.bold(directory))} exists but is not a directory`
    )
  }
}
