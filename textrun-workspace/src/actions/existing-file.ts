import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-core"

export async function existingFile(action: textRunner.actions.Args): Promise<void> {
  const fileName = action.region.text()
  const fileRelPath = path.join(action.region[0].attributes["dir"] || ".", fileName)
  action.name(`verify existence of file ${color.cyan(fileRelPath)}`)
  const fullPath = action.configuration.workspace.joinStr(fileRelPath)
  try {
    await fs.stat(fullPath)
  } catch (e) {
    if (!textRunner.isFsError(e)) {
      throw e
    }
    if (e.code === "ENOENT") {
      const files = await fs.readdir(action.configuration.sourceDir.platformified())
      throw new textRunner.UserError(
        `file not found: ${fileRelPath}`,
        `the workspace has these files: ${files.join(", ")}`
      )
    } else {
      throw e
    }
  }
}
