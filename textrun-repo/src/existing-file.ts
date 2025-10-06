import { promises as fs } from "fs"
import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

export async function existingFile(action: textRunner.actions.Args): Promise<void> {
  const fileName = action.region.text()
  action.name(`document mentions source code file ${styleText("cyan", fileName)}`)
  const fullPath = action.configuration.sourceDir.joinStr(fileName)
  action.log(`ls ${fullPath}`)
  try {
    var stats = await fs.stat(fullPath)
  } catch (err) {
    if (!textRunner.isFsError(err)) {
      throw err
    }
    if (err.code === "ENOENT") {
      throw new Error(`file not found: ${styleText("cyan", fileName)}`)
    } else {
      throw err
    }
  }
  if (stats.isDirectory()) {
    throw new Error(`expected ${styleText("cyan", fileName)} to be a file but is a directory`)
  }
}
