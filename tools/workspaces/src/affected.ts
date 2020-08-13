import * as color from "colorette"
import { YarnReader, YarnOutput } from "./yarn-reader"
import { WorkspaceTagger } from "./workspace-tagger"
import { LogFunc } from "./log-func"
import { readStdin } from "./read-stdin"
import { writeStdout } from "./write-stdout"

export function affected(yarnOutput: YarnOutput, log: LogFunc) {
  const yarnReader = new YarnReader(yarnOutput)

  // determine the provided workspaces
  const files = readStdin()
  const taggedWorkspaces = new WorkspaceTagger(yarnReader.workspaces())
  taggedWorkspaces.tagFiles(files)
  const providedWorkspaces = taggedWorkspaces.tagged()
  log("changed workspaces:", providedWorkspaces)

  // determine the affected workspaces
  for (const workspace of providedWorkspaces) {
    const downstreams = yarnReader.downstreamsFor(workspace)
    for (const downstream of downstreams) {
      if (!taggedWorkspaces.isTagged(downstream)) {
        log(`${color.cyan(workspace)} is a downstream of ${color.cyan(downstream)}`)
      }
    }
    taggedWorkspaces.tagWorkspaces(downstreams)
  }
  const affectedWorkspaces = taggedWorkspaces.tagged()
  log("all affected workspaces:", affectedWorkspaces)

  // write to STDOUT
  writeStdout(affectedWorkspaces)
}
