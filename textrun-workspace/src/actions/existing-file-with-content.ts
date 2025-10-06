import * as assertNoDiff from "assert-no-diff"
import { promises as fs } from "fs"
import { styleText } from "node:util"
import * as path from "path"
import * as textRunner from "text-runner-engine"

export async function existingFileWithContent(action: textRunner.actions.Args): Promise<void> {
  const fileNameAttribute = action.region[0].attributes["filename"]
  const fileName = fileNameAttribute || action.region.textInNodeOfType("em", "strong")
  const dirAttribute = action.region[0].attributes["dir"]
  const fileRelPath = dirAttribute ? path.join(dirAttribute, fileName) : fileName
  const fullPath = action.configuration.workspace.joinStr(fileRelPath)
  const partialMatch = action.region[0].attributes["partial-match"] !== undefined
  const expectedContent = fileNameAttribute ? action.region.text() : action.region.textInNodeOfType("fence", "code")
  if (partialMatch) {
    action.name(`file ${styleText("cyan", fileRelPath)} contains substring ${expectedContent}`)
  } else {
    action.name(`verify content of file ${styleText("cyan", fileRelPath)}`)
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
      throw new textRunner.UserError(
        `file ${styleText(["cyan", "bold"], fileRelPath)} does not contain "${expectedContent}"`,
        actualContent
      )
    }
  } else {
    try {
      assertNoDiff.trimmedLines(actualContent.trim(), expectedContent.trim())
    } catch (err) {
      action.log(actualContent)
      throw new textRunner.UserError(
        `mismatching content in ${styleText("cyan", styleText("bold", fileRelPath))}`,
        textRunner.errorMessage(err)
      )
    }
  }
}
