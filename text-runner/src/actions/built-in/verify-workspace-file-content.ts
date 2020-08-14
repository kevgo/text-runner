import * as assertNoDiff from "assert-no-diff"
import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import { ActionArgs } from "../types/action-args"

export default async function verifyWorkspaceFileContent(args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType("strong", "em")
  const fullPath = path.join(process.cwd(), filePath)
  args.name(`verifying file ${color.cyan(filePath)}`)
  args.log(`verify file ${fullPath}`)
  const actualContent = await readFile(filePath, fullPath)
  const expectedContent = args.nodes.textInNodeOfType("fence", "code")
  try {
    assertNoDiff.trimmedLines(actualContent.trim(), expectedContent.trim())
  } catch (err) {
    throw new Error(`mismatching content in ${color.cyan(color.bold(filePath))}:\n${err.message}`)
  }
}

async function readFile(filePath: string, fullPath: string): Promise<string> {
  try {
    const result = await fs.readFile(fullPath, "utf8")
    return result
  } catch (err) {
    if (err.code === "ENOENT") {
      // TODO: show all files in the folder here
      throw new Error(`file ${color.red(filePath)} not found`)
    } else {
      throw err
    }
  }
}
