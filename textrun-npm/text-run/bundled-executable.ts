import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

/** creates a binary with the given name in the workspace */
export default async function bundledExecutable(action: tr.actions.Args): Promise<void> {
  const name = action.region.text()
  const filePath = path.join(action.configuration.workspace.platformified(), name)
  const dirPath = path.dirname(filePath)
  await fs.mkdir(dirPath)
  await fs.writeFile(filePath, "")
}
