import color from "colorette"
import fs from "fs-extra"
import path from "path"
import { ActionArgs } from "../action-args"

export default async function createDirectory(args: ActionArgs) {
  const directoryName = args.nodes.text().trim()
  if (!directoryName) {
    throw new Error("empty directory name given")
  }
  args.formatter.name(`create directory ${color.cyan(directoryName)}`)
  const fullPath = path.join(args.configuration.workspace, directoryName)
  await fs.ensureDir(fullPath)
}
