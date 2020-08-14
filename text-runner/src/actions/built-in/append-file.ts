import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "../types/action-args"

export default async function appendFile(args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType("em", "strong")
  const content = args.nodes.textInNodeOfType("fence", "code")
  args.name(`append to file ${color.cyan(filePath)}`)
  const fullPath = path.join(args.configuration.workspace, filePath)
  args.log(`append to file ${fullPath}`)
  await fs.appendFile(fullPath, content)
}
