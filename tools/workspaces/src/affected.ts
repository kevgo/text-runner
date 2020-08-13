import * as color from "colorette"
import { YarnReader, YarnOutput } from "./yarn-reader"
import { WorkspaceTagger } from "./workspace-tagger"
import { LogFunc } from "./log-func"
import { readStdin } from "./read-stdin"
import { writeStdout } from "./write-stdout"

export function affected(yarnOutput: YarnOutput, log: LogFunc) {
  const yarnReader = new YarnReader(yarnOutput)

  // determine the provided workspaces
  const tagger = new WorkspaceTagger(yarnReader.workspaces())
  tagger.tagFiles(readStdin())
  const providedWorkspaces = tagger.tagged()
  log("changed workspaces:", providedWorkspaces)

  // determine the affected workspaces
  for (const workspace of providedWorkspaces) {
    const downstreams = yarnReader.downstreamsFor(workspace)
    for (const downstream of downstreams) {
      if (!tagger.isTagged(downstream)) {
        log(`${color.cyan(workspace)} is a downstream of ${color.cyan(downstream)}`)
      }
    }
    tagger.tagWorkspaces(downstreams)
  }
  const affectedWorkspaces = tagger.tagged()
  log("affected workspaces:", affectedWorkspaces)

  // write to STDOUT
  writeStdout(affectedWorkspaces)
}
