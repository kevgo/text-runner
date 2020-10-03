import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

export async function additionalFileContent(action: tr.actions.Args): Promise<void> {
  const fileName = action.region.textInNodeOfType("em", "strong")
  const fileRelPath = path.join(action.region[0].attributes["dir"] || ".", fileName)
  action.name(`append to file ${color.cyan(fileRelPath)}`)
  const content = action.region.textInNodeOfType("fence", "code")
  const fullPath = path.join(action.configuration.workspace, fileRelPath)
  action.log(content)
  await fs.appendFile(fullPath, content)
}
