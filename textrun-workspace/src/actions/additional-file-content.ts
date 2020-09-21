import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

export async function additionalFileContent(action: tr.ActionArgs): Promise<void> {
  const filePath = action.region.textInNodeOfType("em", "strong")
  const content = action.region.textInNodeOfType("fence", "code")
  action.name(`append to file ${color.cyan(filePath)}`)
  const fullPath = path.join(action.configuration.workspace, filePath)
  action.log(content)
  await fs.appendFile(fullPath, content)
}
