import * as childProcessRaw from "child_process"
import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-engine"
import * as util from "util"
const execAsync = util.promisify(childProcessRaw.exec)

export async function runAsFile(action: textRunner.actions.Args): Promise<void> {
  // determine data
  const fileName = action.region[0].attributes["filename"] || "1.ts"
  const content = action.region.text()
  const filePath = path.join(action.region[0].attributes["dir"] ?? ".", fileName)
  action.name(`create file ${color.cyan(filePath)}`)
  const fullPath = action.configuration.workspace.joinStr(filePath)
  action.log(`create file ${filePath}`)

  // create the file
  await fs.mkdir(path.dirname(fullPath), { recursive: true })
  await fs.writeFile(fullPath, content)

  // execute the file
  await execAsync(`node ${fullPath}`, { cwd: action.configuration.workspace.platformified() })
}
