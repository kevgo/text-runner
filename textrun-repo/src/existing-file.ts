import * as color from "colorette"
import { promises as fs } from "fs"
import * as tr from "text-runner-core"

export async function existingFile(action: tr.actions.Args): Promise<void> {
  const fileName = action.region.text()
  action.name(`document mentions source code file ${color.cyan(fileName)}`)
  const fullPath = action.configuration.sourceDir.joinStr(fileName)
  action.log(`ls ${fullPath}`)
  try {
    var stats = await fs.stat(fullPath)
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(`file not found: ${color.cyan(fileName)}`)
    } else {
      throw err
    }
  }
  if (stats.isDirectory()) {
    throw new Error(`expected ${color.cyan(fileName)} to be a file but is a directory`)
  }
}
