import { ActionArgs } from "../types/action-args"
import { promises as fs } from "fs"
import * as path from "path"
import { callArgs } from "../helpers/call-args"
import { createObservableProcess } from "observable-process"
import stripAnsi = require("strip-ansi")

/** runs the given Markdown in Text-Runner */
export async function runInTextrunner(action: ActionArgs) {
  action.name("execute Markdown in Text-Runner")
  const content = action.nodes.text()
  // TODO: call an internal Text-Runner API here, see https://github.com/kevgo/text-runner/issues/903
  await fs.writeFile(path.join(action.configuration.workspace, "1.md"), content)
  // TODO: call existing Text-Runner API here
  var textRunPath = path.join(action.configuration.sourceDir, "..", "text-runner", "bin", "text-run")
  if (process.platform === "win32") textRunPath += ".cmd"
  const trArgs = callArgs(textRunPath)
  trArgs[trArgs.length - 1] += " --keep-tmp --workspace=."
  const processor = createObservableProcess(trArgs, { cwd: action.configuration.workspace })
  await processor.waitForEnd()
  action.log(processor.output.fullText())
  if (processor.exitCode !== 0) {
    throw new Error(
      `text-run exited with code ${processor.exitCode} when processing this markdown block:\n${stripAnsi(
        processor.output.fullText()
      )}`
    )
  }
}
