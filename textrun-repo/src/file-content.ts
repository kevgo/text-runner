import * as assertNoDiff from "assert-no-diff"
import * as color from "colorette"
import * as eol from "eol"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "text-runner"

export async function fileContent(action: ActionArgs) {
  const fileName = action.region.textInNodeOfType("em_open", "strong_open")
  let relativeBaseDir = "."
  if (action.region.hasNodeOfType("link_open")) {
    const linkNode = action.region.getNodeOfTypes("link_open")
    relativeBaseDir = linkNode.attributes.href
  }
  const expectedContent = action.region.textInNodeOfTypes("fence", "code")
  const filePath = path.join(path.dirname(action.file), relativeBaseDir, fileName)
  action.name(`document content matches source code file ${color.cyan(filePath)}`)
  const fullPath = path.join(action.configuration.sourceDir, filePath)
  action.log(`ls ${fullPath}`)
  let actualContent
  try {
    actualContent = await fs.readFile(fullPath, "utf8")
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(`file not found: ${color.cyan(filePath)}`)
    } else {
      throw err
    }
  }
  try {
    assertNoDiff.trimmedLines(eol.lf(actualContent.trim()), eol.lf(expectedContent.trim()))
  } catch (err) {
    throw new Error(`mismatching content in ${color.cyan(color.bold(filePath))}:\n${err.message}`)
  }
}
