import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import * as tr from "text-runner-core"

export async function newDirectory(action: tr.actions.Args): Promise<void> {
  const dirName = action.region.text().trim()
  if (!dirName) {
    throw new Error("empty directory name given")
  }
  const dirRelName = path.join(action.region[0].attributes["dir"] || ".", dirName)
  action.name(`create directory ${color.cyan(dirRelName)}`)
  const fullPath = path.join(action.configuration.workspace.platformified(), dirRelName)
  await fs.ensureDir(fullPath)
}
