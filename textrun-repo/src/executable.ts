import * as color from "colorette"
import * as fs from "fs"
import { promises as fsp } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"
import { instanceOfNodeFsError } from "text-runner-core/dist/errors/user-error"

export async function executable(action: tr.actions.Args): Promise<void> {
  const fileName = action.region.text()
  const filePath = path.join(action.location.file.directory().platformified(), fileName)
  action.name(`repository contains executable ${color.cyan(filePath)}`)
  const fullPath = action.configuration.sourceDir.joinStr(filePath)
  action.log(`ls ${fullPath}`)
  try {
    await fsp.access(fullPath, fs.constants.X_OK)
  } catch (err) {
    if (!instanceOfNodeFsError(err)) {
      throw err
    }
    switch (err.code) {
      case "EACCES":
        throw new tr.UserError(`file is not executable: ${color.cyan(filePath)}`, "", action.location)
      case "ENOENT":
        throw new tr.UserError(`file not found: ${color.cyan(filePath)}`, "", action.location)
      default:
        throw err
    }
  }
}
