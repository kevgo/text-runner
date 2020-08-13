import * as color from "colorette"
import * as os from "os"
import * as fs from "fs"
import { YarnReader, YarnOutput } from "./yarn-reader"
import { WorkspaceTagger } from "./workspace-tagger"

interface LogFunc {
  (message?: any, ...optionalParams: any[]): void
}

export function workspaces(yarnOutput: YarnOutput, log: LogFunc) {
  // learn workspace dependency info
  const yarnInfo = new YarnReader(yarnOutput)

  // determine the provided workspaces
  const files = fs.readFileSync(0, "utf-8").split(os.EOL)
  const taggedWorkspaces = new WorkspaceTagger(yarnInfo.workspaces())
  for (const file of files) {
    const workspace = taggedWorkspaces.getWorkspace(file)
    taggedWorkspaces.tag(workspace)
  }
  const providedWorkspaces = taggedWorkspaces.tagged()
  log("changed workspaces:", providedWorkspaces)

  // determine all affected workspaces
  for (const workspace of providedWorkspaces) {
    const downstreams = yarnInfo.downstreamsFor(workspace)
    for (const downstream of downstreams) {
      if (!taggedWorkspaces.isTagged(downstream)) {
        log(`${color.cyan(workspace)} is a downstream of ${color.cyan(downstream)}`)
      }
    }
    taggedWorkspaces.tagMany(downstreams)
  }
  const affectedWorkspaces = taggedWorkspaces.tagged()
  log("all affected workspaces:", affectedWorkspaces)

  // write to STDOUT
  console.log(affectedWorkspaces.join(os.EOL))
}
