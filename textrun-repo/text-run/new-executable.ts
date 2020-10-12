import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

export async function newExecutable(action: tr.actions.Args): Promise<void> {
  const name = action.region.text()
  const dirName = path.dirname(name)
  await fs.mkdir(path.join(action.configuration.workspace.platformified(), dirName))
  await fs.writeFile(path.join(action.configuration.workspace.platformified(), name), "", { mode: 0o744 })
}
