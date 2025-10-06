import * as assertNoDiff from "assert-no-diff"
import eol from "eol"
import { promises as fs } from "fs"
import { styleText } from "node:util"
import * as path from "path"
import * as textRunner from "text-runner-engine"

export async function existingFileContent(action: textRunner.actions.Args): Promise<void> {
  const fileName = action.region.textInNodeOfType("em_open", "strong_open")
  let relativeBaseDir = "."
  if (action.region.hasNodeOfType("link_open")) {
    const linkNode = action.region.nodeOfTypes("link_open")
    relativeBaseDir = linkNode.attributes.href
  }
  let expectedContent = action.region.textInNodeOfTypes("fence", "code")
  const filePath = path.join(action.location.file.directory().platformified(), relativeBaseDir, fileName)
  action.name(`document content matches source code file ${styleText("cyan", filePath)}`)
  const fullPath = action.configuration.sourceDir.joinStr(filePath)
  action.log(`cat ${fullPath}`)
  let actualContent
  try {
    actualContent = await fs.readFile(fullPath, "utf8")
  } catch (err) {
    if (!textRunner.isFsError(err)) {
      throw err
    }
    if (err.code === "ENOENT") {
      throw new Error(`file not found: ${styleText("cyan", filePath)}`)
    } else {
      throw err
    }
  }
  actualContent = eol.lf(actualContent.trim())
  expectedContent = eol.lf(expectedContent.trim())
  try {
    assertNoDiff.trimmedLines(actualContent, expectedContent)
  } catch (err) {
    throw new textRunner.UserError(
      `mismatching content in ${styleText("cyan", styleText("bold", filePath))}`,
      textRunner.errorMessage(err)
    )
  }
}
