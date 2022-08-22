import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner"

export async function newExecutable(action: textRunner.actions.Args): Promise<void> {
  const name = action.region.text()
  const dirName = path.dirname(name)
  await fs.mkdir(path.join(action.configuration.workspace.platformified(), dirName))
  await fs.writeFile(path.join(action.configuration.workspace.platformified(), name), "", { mode: 0o744 })
}
