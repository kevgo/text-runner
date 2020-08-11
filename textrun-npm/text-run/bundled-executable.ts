import { ActionArgs } from "text-runner"
import { promises as fs } from "fs"
import path from "path"

/** creates a binary with the given name in the workspace */
export default async function bundledExecutable(action: ActionArgs) {
  const name = action.nodes.text()
  const filePath = path.join(action.configuration.workspace, name)
  const dirPath = path.dirname(filePath)
  await fs.mkdir(dirPath)
  await fs.writeFile(filePath, "")
}
