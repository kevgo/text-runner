import * as color from "colorette"
import Debug from "debug"
import * as fs from "fs"
import { promises as fsp } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-engine"

const debug = Debug("executable")

export async function executable(action: textRunner.actions.Args): Promise<void> {
  const fileName = action.region.text()
  const filePath = path.join(action.location.file.directory().platformified(), fileName)
  action.name(`repository contains executable ${color.cyan(filePath)}`)
  const fullPath = action.configuration.sourceDir.joinStr(filePath)
  debug(`ls ${fullPath}`)
  try {
    await fsp.access(fullPath, fs.constants.X_OK)
  } catch (err) {
    if (!textRunner.isFsError(err)) {
      throw err
    }
    switch (err.code) {
      case "EACCES":
        throw new textRunner.UserError(`file is not executable: ${color.cyan(filePath)}`, "", action.location)
      case "ENOENT":
        throw new textRunner.UserError(`file not found: ${color.cyan(filePath)}`, "", action.location)
      default:
        throw err
    }
  }
}
