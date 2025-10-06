import * as fs from "fs"
import { promises as fsp } from "fs"
import { styleText } from "node:util"
import * as path from "path"
import * as textRunner from "text-runner-engine"

export async function executable(action: textRunner.actions.Args): Promise<void> {
  const fileName = action.region.text()
  const filePath = path.join(action.location.file.directory().platformified(), fileName)
  action.name(`repository contains executable ${styleText("cyan", filePath)}`)
  const fullPath = action.configuration.sourceDir.joinStr(filePath)
  action.log(`ls ${fullPath}`)
  try {
    await fsp.access(fullPath, fs.constants.X_OK)
  } catch (err) {
    if (!textRunner.isFsError(err)) {
      throw err
    }
    switch (err.code) {
      case "EACCES":
        throw new textRunner.UserError(`file is not executable: ${styleText("cyan", filePath)}`, "", action.location)
      case "ENOENT":
        throw new textRunner.UserError(`file not found: ${styleText("cyan", filePath)}`, "", action.location)
      default:
        throw err
    }
  }
}
