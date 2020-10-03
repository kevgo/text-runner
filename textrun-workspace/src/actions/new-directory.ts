import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import * as tr from "text-runner-core"

export async function newDirectory(action: tr.actions.Args): Promise<void> {
  let directoryName = action.region.text().trim()
  if (!directoryName) {
    throw new Error("empty directory name given")
  }
  directoryName = path.join(action.region[0].attributes["dir"] || ".", directoryName)
  action.name(`create directory ${color.cyan(directoryName)}`)
  const fullPath = path.join(action.configuration.workspace, directoryName)
  await fs.ensureDir(fullPath)
}
