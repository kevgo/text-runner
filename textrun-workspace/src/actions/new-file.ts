import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-core"

export async function newFile(action: textRunner.actions.Args): Promise<void> {
  let fileName = action.region[0].attributes["filename"] || ""
  try {
    fileName ||= action.region.textInNodeOfType("em", "strong")
  } catch (e) {
    if (!textRunner.isUserError(e)) {
      throw e
    }
    const guidance = `Cannot determine the name of the file to create.\n${e.guidance}`
    throw new textRunner.UserError(e.message, guidance)
  }
  try {
    var content = action.region.textInNodeOfType("fence", "code")
  } catch (e) {
    if (!textRunner.isUserError(e)) {
      throw e
    }
    const guidance = `Cannot determine the content of the file to create.\n${e.guidance}`
    throw new textRunner.UserError(e.message, guidance)
  }
  const filePath = path.join(action.region[0].attributes["dir"] ?? ".", fileName)
  action.name(`create file ${color.cyan(filePath)}`)
  const fullPath = action.configuration.workspace.joinStr(filePath)
  action.log(`create file ${filePath}`)
  await fs.mkdir(path.dirname(fullPath), { recursive: true })
  await fs.writeFile(fullPath, content)
}
