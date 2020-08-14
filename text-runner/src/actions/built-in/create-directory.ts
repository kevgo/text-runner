import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "../types/action-args"

export default async function createDirectory(action: ActionArgs) {
  const directoryName = action.nodes.text().trim()
  if (!directoryName) {
    throw new Error("empty directory name given")
  }
  action.name(`create directory ${color.cyan(directoryName)}`)
  const fullPath = path.join(action.configuration.workspace, directoryName)
  await fs.ensureDir(fullPath)
}
