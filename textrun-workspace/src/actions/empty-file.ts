import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-core"

export async function emptyFile(action: textRunner.actions.Args): Promise<void> {
  const fileName = action.region.text().trim()
  if (fileName === "") {
    throw new textRunner.UserError("No filename given", "")
  }
  const filePath = path.join(action.region[0].attributes["dir"] ?? ".", fileName)
  action.name(`create file ${color.cyan(filePath)}`)
  const fullPath = action.configuration.workspace.joinStr(filePath)
  action.log(`create file ${filePath}`)
  await fs.mkdir(path.dirname(fullPath), { recursive: true })
  await fs.writeFile(fullPath, "")
}
