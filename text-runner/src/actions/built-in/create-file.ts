import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "../types/action-args"

export default async function createFile(args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType("em", "strong")
  const content = args.nodes.textInNodeOfType("fence", "code")
  args.name(`create file ${color.cyan(filePath)}`)
  const fullPath = path.join(args.configuration.workspace, filePath)
  args.log(`create file ${fullPath}`)
  await fs.ensureDir(path.dirname(fullPath))
  await fs.writeFile(fullPath, content)
}
