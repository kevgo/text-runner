import * as color from "colorette"
import { promises as fs } from "fs"
import * as textRunner from "text-runner-engine"

export async function existingFile(action: textRunner.actions.Args): Promise<void> {
  const fileName = action.region.text()
  action.name(`document mentions source code file ${color.cyan(fileName)}`)
  const fullPath = action.configuration.sourceDir.joinStr(fileName)
  action.log(`ls ${fullPath}`)
  try {
    var stats = await fs.stat(fullPath)
  } catch (err) {
    if (!textRunner.isFsError(err)) {
      throw err
    }
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
