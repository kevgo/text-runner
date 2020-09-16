import * as tr from "text-runner-core"
import { promises as fs } from "fs"
import * as path from "path"

/** creates a binary with the given name in the workspace */
export default async function bundledExecutable(action: tr.ActionArgs) {
  const name = action.region.text()
  const filePath = path.join(action.configuration.workspace, name)
  const dirPath = path.dirname(filePath)
  await fs.mkdir(dirPath)
  await fs.writeFile(filePath, "")
}
