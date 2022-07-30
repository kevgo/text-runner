import * as assertNoDiff from "assert-no-diff"
import * as color from "colorette"
import * as eol from "eol"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"
import { instanceOfFsError } from "text-runner-core/dist/errors/node-error"

export async function existingFileContent(action: tr.actions.Args): Promise<void> {
  const fileName = action.region.textInNodeOfType("em_open", "strong_open")
  let relativeBaseDir = "."
  if (action.region.hasNodeOfType("link_open")) {
    const linkNode = action.region.nodeOfTypes("link_open")
    relativeBaseDir = linkNode.attributes.href
  }
  const expectedContent = action.region.textInNodeOfTypes("fence", "code")
  const filePath = path.join(action.location.file.directory().platformified(), relativeBaseDir, fileName)
  action.name(`document content matches source code file ${color.cyan(filePath)}`)
  const fullPath = action.configuration.sourceDir.joinStr(filePath)
  action.log(`cat ${fullPath}`)
  let actualContent
  try {
    actualContent = await fs.readFile(fullPath, "utf8")
  } catch (err) {
    if (!instanceOfFsError(err)) {
      throw err
    }
    if (err.code === "ENOENT") {
      throw new Error(`file not found: ${color.cyan(filePath)}`)
    } else {
      throw err
    }
  }
  try {
    assertNoDiff.trimmedLines(eol.lf(actualContent.trim()), eol.lf(expectedContent.trim()))
  } catch (err) {
    if (!(err instanceof Error)) {
      throw err
    }
    throw new tr.UserError(`mismatching content in ${color.cyan(color.bold(filePath))}`, err.message)
  }
}
