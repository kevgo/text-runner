import { promises as fs } from "fs"
import { styleText } from "node:util"
import * as path from "path"
import * as textRunner from "text-runner-engine"

export async function existingFile(action: textRunner.actions.Args): Promise<void> {
  const fileName = action.region.text()
  const fileRelPath = path.join(action.region[0].attributes["dir"] || ".", fileName)
  action.name(`verify existence of file ${styleText("cyan", fileRelPath)}`)
  const fullPath = action.configuration.workspace.joinStr(fileRelPath)
  try {
    await fs.stat(fullPath)
  } catch (e) {
    if (!textRunner.isFsError(e)) {
      throw e
    }
    if (e.code === "ENOENT") {
      const files = await fs.readdir(action.configuration.workspace.platformified())
      throw new textRunner.UserError(
        `file not found: ${fileRelPath}`,
        `the workspace has these files: ${files.join(", ")}`
      )
    } else {
      throw e
    }
  }
}
