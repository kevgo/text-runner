import * as assertNoDiff from "assert-no-diff"
import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

export async function existingFile(action: tr.actions.Args): Promise<void> {
  const fileName = action.region.textInNodeOfType("strong", "em")
  const fileRelPath = path.join(action.region[0].attributes["dir"] || ".", fileName)
  action.name(`verify content of file ${color.cyan(fileRelPath)}`)
  const fullPath = path.join(action.configuration.workspace.platformified(), fileRelPath)
  const expectedContent = action.region.textInNodeOfType("fence", "code")
  action.log(expectedContent)
  let actualContent = ""
  try {
    actualContent = await fs.readFile(fullPath, "utf-8")
  } catch (e) {
    if (e.code === "ENOENT") {
      const files = await fs.readdir(process.cwd())
      throw new tr.UserError(
        `file not found: ${fileRelPath}`,
        `folder "${process.cwd()}" has these files: ${files.join(", ")}`
      )
    } else {
      throw e
    }
  }
  try {
    assertNoDiff.trimmedLines(actualContent.trim(), expectedContent.trim())
  } catch (err) {
    throw new tr.UserError(`mismatching content in ${color.cyan(color.bold(fileRelPath))}`, err.message)
  }
}
