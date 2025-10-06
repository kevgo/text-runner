import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-engine"

export async function additionalFileContent(action: textRunner.actions.Args): Promise<void> {
  const fileNameAttribute = action.region[0].attributes["filename"]
  if (fileNameAttribute === "") {
    throw new textRunner.UserError(`attribute "filename" is empty`, "")
  }
  const fileName = fileNameAttribute || action.region.textInNodeOfType("em", "strong")
  const dirAttribute = action.region[0].attributes["dir"]
  const fileRelPath = dirAttribute ? path.join(dirAttribute, fileName) : fileName
  action.name(`append to file ${color.cyan(fileRelPath)}`)
  const fullPath = action.configuration.workspace.joinStr(fileRelPath)
  try {
    await fs.access(fullPath, fs.constants.F_OK)
  } catch (e) {
    if (e instanceof Error) {
      throw new textRunner.UserError(`file ${fileRelPath} doesn't exist`, e.message)
    }
  }
  const content = fileNameAttribute ? action.region.text() : action.region.textInNodeOfType("fence", "code")
  action.log(content)
  await fs.appendFile(fullPath, content)
}
