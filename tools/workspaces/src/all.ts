import { YarnReader, YarnOutput } from "./yarn-reader"
import { LogFunc } from "./log-func"
import { writeStdout } from "./write-stdout"

export function all(yarnOutput: YarnOutput, log: LogFunc) {
  const yarnReader = new YarnReader(yarnOutput)
  writeStdout(yarnReader.workspaces())
}
