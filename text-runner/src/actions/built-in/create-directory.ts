import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "../types/action-args"

export default async function createDirectory(args: ActionArgs) {
  const directoryName = args.nodes.text().trim()
  if (!directoryName) {
    throw new Error("empty directory name given")
  }
  args.name(`create directory ${color.cyan(directoryName)}`)
  const fullPath = path.join(args.configuration.workspace, directoryName)
  await fs.ensureDir(fullPath)
}
