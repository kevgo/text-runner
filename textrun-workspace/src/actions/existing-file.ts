import * as assertNoDiff from "assert-no-diff"
import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

export async function existingFile(action: tr.actions.Args): Promise<void> {
  const fileName = action.region.textInNodeOfType("strong", "em")
  const fileRelPath = path.join(action.region[0].attributes["dir"] || ".", fileName)
  action.name(`verify content of file ${color.cyan(fileRelPath)}`)
  const fullPath = action.configuration.workspace.joinStr(fileRelPath)
  const expectedContent = action.region.textInNodeOfType("fence", "code")
  action.log(expectedContent)
  try {
    var actualContent = await fs.readFile(fullPath, "utf-8")
  } catch (e) {
    const fsErr = e as NodeJS.ErrnoException
    if (fsErr.code === "ENOENT") {
      const files = await fs.readdir(action.configuration.sourceDir.platformified())
      throw new tr.UserError(`file not found: ${fileRelPath}`, `the workspace has these files: ${files.join(", ")}`)
    } else {
      throw e
    }
  }
  try {
    assertNoDiff.trimmedLines(actualContent.trim(), expectedContent.trim())
  } catch (e) {
    const err = e as Error
    throw new tr.UserError(`mismatching content in ${color.cyan(color.bold(fileRelPath))}`, err.message)
  }
}
