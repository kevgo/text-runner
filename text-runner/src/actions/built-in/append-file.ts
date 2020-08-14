import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "../types/action-args"

export default async function appendFile(action: ActionArgs) {
  const filePath = action.nodes.textInNodeOfType("em", "strong")
  const content = action.nodes.textInNodeOfType("fence", "code")
  action.name(`append to file ${color.cyan(filePath)}`)
  const fullPath = path.join(action.configuration.workspace, filePath)
  action.log(`append to file ${fullPath}`)
  await fs.appendFile(fullPath, content)
}
