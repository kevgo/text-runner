import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "text-runner"

export async function createFile(action: ActionArgs) {
  const filePath = action.region.textInNodeOfType("em", "strong")
  const content = action.region.textInNodeOfType("fence", "code")
  action.name(`create file ${color.cyan(filePath)}`)
  const fullPath = path.join(action.configuration.workspace, filePath)
  action.log(`create file ${fullPath}`)
  await fs.ensureDir(path.dirname(fullPath))
  await fs.writeFile(fullPath, content)
}
