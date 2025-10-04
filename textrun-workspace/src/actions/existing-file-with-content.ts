import * as assertNoDiff from "assert-no-diff"
import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-engine"

export async function existingFileWithContent(action: textRunner.actions.Args): Promise<void> {
  const fileName = action.region.textInNodeOfType("strong", "em")
  const fileRelPath = path.join(action.region[0].attributes["dir"] || ".", fileName)
  const fullPath = action.configuration.workspace.joinStr(fileRelPath)
  const partialMatch = action.region[0].attributes["partial-match"] !== undefined
  const expectedContent = action.region.textInNodeOfType("fence", "code")
  if (partialMatch) {
    action.name(`file ${color.cyan(fileRelPath)} contains substring ${expectedContent}`)
  } else {
    action.name(`verify content of file ${color.cyan(fileRelPath)}`)
  }
  try {
    var actualContent = await fs.readFile(fullPath, "utf-8")
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
  if (partialMatch) {
    if (!actualContent.includes(expectedContent)) {
      action.log(actualContent)
      throw new Error(`file ${color.cyan(color.bold(fileRelPath))} does not contain "${expectedContent}"`)
    }
  } else {
    try {
      assertNoDiff.trimmedLines(actualContent.trim(), expectedContent.trim())
    } catch (err) {
      action.log(actualContent)
      throw new textRunner.UserError(
        `mismatching content in ${color.cyan(color.bold(fileRelPath))}`,
        textRunner.errorMessage(err)
      )
    }
  }
}
