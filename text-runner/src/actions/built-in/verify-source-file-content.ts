import * as assertNoDiff from "assert-no-diff"
import * as color from "colorette"
import * as eol from "eol"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "../types/action-args"

export default async function verifySourceFileContent(args: ActionArgs) {
  const fileName = args.nodes.textInNodeOfType("strong_open")
  let relativeBaseDir = "."
  if (args.nodes.hasNodeOfType("link_open")) {
    const linkNode = args.nodes.getNodeOfTypes("link_open")
    relativeBaseDir = linkNode.attributes.href
  }
  const expectedContent = args.nodes.textInNodeOfTypes("fence", "code")
  args.name(`verifying document content matches source code file ${color.cyan(fileName)}`)
  const filePath = path.join(args.configuration.sourceDir, path.dirname(args.file), relativeBaseDir, fileName)
  args.log(`ls ${filePath}`)
  let actualContent
  try {
    actualContent = await fs.readFile(filePath, "utf8")
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(`file ${color.cyan(fileName)} not found`)
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
