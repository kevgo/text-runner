import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-engine"

export async function newDirectory(action: textRunner.actions.Args): Promise<void> {
  const dirName = action.region.text().trim()
  if (!dirName) {
    throw new Error("empty directory name given")
  }
  const dirRelName = path.join(action.region[0].attributes["dir"] || ".", dirName)
  action.name(`create directory ${color.cyan(dirRelName)}`)
  const fullPath = action.configuration.workspace.joinStr(dirRelName)
  await fs.mkdir(fullPath, { recursive: true })
}
