import * as assertNoDiff from "assert-no-diff"
import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import { ActionArgs } from "text-runner"

export async function existingFile(action: ActionArgs) {
  const filePath = action.region.textInNodeOfType("strong", "em")
  const fullPath = path.join(process.cwd(), filePath)
  action.name(`verify content of file ${color.cyan(filePath)}`)
  const expectedContent = action.region.textInNodeOfType("fence", "code")
  action.log(expectedContent)
  let actualContent = ""
  try {
    actualContent = await fs.readFile(fullPath, "utf-8")
  } catch (e) {
    if (e.code === "ENOENT") {
      // TODO: show all files in the folder here
      const files = await fs.readdir(process.cwd())
      throw new Error(`file not found: ${filePath}\n\nfolder "${process.cwd()}" has these files: ${files.join(", ")}`)
    } else {
      throw e
    }
  }
  try {
    assertNoDiff.trimmedLines(actualContent.trim(), expectedContent.trim())
  } catch (err) {
    throw new Error(`mismatching content in ${color.cyan(color.bold(filePath))}:\n${err.message}`)
  }
}
