import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-engine"

export async function additionalFileContent(action: textRunner.actions.Args): Promise<void> {
  const fileNameAttribute = action.region[0].attributes["filename"]
  const fileName = fileNameAttribute || action.region.textInNodeOfType("em", "strong")
  const dirAttribute = action.region[0].attributes["dir"]
  const fileRelPath = dirAttribute ? path.join(dirAttribute, fileName) : fileName
  action.name(`append to file ${color.cyan(fileRelPath)}`)
  const fullPath = action.configuration.workspace.joinStr(fileRelPath)
  const content = fileNameAttribute ? action.region.text() : action.region.textInNodeOfType("fence", "code")
  action.log(content)
  console.log("11111111111111111111111111111111111111111", fullPath)
  try {
    await fs.access(fullPath, fs.constants.F_OK)
  } catch (e) {
    if (e instanceof Error) {
      throw new textRunner.UserError(`cannot access file ${fileRelPath}`, e.message)
    }
  }
  await fs.appendFile(fullPath, content)
}
