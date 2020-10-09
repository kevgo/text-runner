import * as assertNoDiff from "assert-no-diff"
import * as color from "colorette"
import * as eol from "eol"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

export async function existingFile(action: tr.actions.Args): Promise<void> {
  const fileName = action.region.textInNodeOfType("em_open", "strong_open")
  let relativeBaseDir = "."
  if (action.region.hasNodeOfType("link_open")) {
    const linkNode = action.region.getNodeOfTypes("link_open")
    relativeBaseDir = linkNode.attributes.href
  }
  const expectedContent = action.region.textInNodeOfTypes("fence", "code")
  const filePath = path.join(action.file.directory().platformified(), relativeBaseDir, fileName)
  action.name(`document content matches source code file ${color.cyan(filePath)}`)
  const fullPath = action.configuration.sourceDir.joinStr(filePath)
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
    throw new tr.UserError(`mismatching content in ${color.cyan(color.bold(filePath))}`, err.message)
  }
}
