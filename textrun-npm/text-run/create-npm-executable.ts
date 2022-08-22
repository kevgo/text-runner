import { promises as fs } from "fs"
import * as textRunner from "text-runner"

/** creates a binary with the given name in the workspace */
export default async function createNPMExecutable(action: textRunner.actions.Args): Promise<void> {
  const name = action.region.text()
  await fs.mkdir(action.configuration.workspace.joinStr("node_modules"))
  await fs.mkdir(action.configuration.workspace.joinStr("node_modules", ".bin"))
  const filePath = action.configuration.workspace.joinStr("node_modules", ".bin", name)
  await fs.writeFile(filePath, "", { mode: 0o744 })
}
