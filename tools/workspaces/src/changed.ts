import { YarnReader, YarnOutput } from "./yarn-reader"
import { WorkspaceTagger } from "./workspace-tagger"
import { LogFunc } from "./log-func"
import { readStdin } from "./read-stdin"
import { writeStdout } from "./write-stdout"

export function changed(yarnOutput: YarnOutput, log: LogFunc) {
  const yarnReader = new YarnReader(yarnOutput)

  // determine the provided workspaces
  const tagger = new WorkspaceTagger(yarnReader.workspaces())
  tagger.tagFiles(readStdin())
  const providedWorkspaces = tagger.tagged()
  log("changed workspaces:", providedWorkspaces)

  // write to STDOUT
  writeStdout(providedWorkspaces)
}
