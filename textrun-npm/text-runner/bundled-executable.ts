import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner"

/** creates a binary with the given name in the workspace */
export default async function bundledExecutable(action: textRunner.actions.Args): Promise<void> {
  const name = action.region.text()
  const filePath = action.configuration.workspace.joinStr(name)
  const dirPath = path.dirname(filePath)
  await fs.mkdir(dirPath)
  await fs.writeFile(filePath, "")
}
