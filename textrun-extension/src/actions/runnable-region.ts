import * as tr from "text-runner-core"
import { promises as fs } from "fs"
import * as path from "path"
import { createObservableProcess } from "observable-process"
import stripAnsi = require("strip-ansi")
import { callArgs } from "../helpers/call-args"

/** runs the given content in Text-Runner */
export async function runnableRegion(action: tr.actions.Args): Promise<void> {
  console.log("RUNNABLE REGION"), action.configuration
  action.name("execute Markdown in Text-Runner")
  const content = action.region.text().trim()
  if (content === "") {
    throw new Error("no content to run found")
  }
  // TODO: call an internal Text-Runner API here, see https://github.com/kevgo/text-runner/issues/903
  await fs.writeFile(path.join(action.configuration.workspace, "1.md"), content)
  // TODO: call existing Text-Runner API here
  let textRunPath = path.join(__dirname, "..", "..", "node_modules", ".bin", "text-run")
  if (process.platform === "win32") textRunPath += ".cmd"
  const trArgs = callArgs(textRunPath, process.platform)
  trArgs[trArgs.length - 1] += " --workspace=."
  const processor = createObservableProcess(trArgs, { cwd: action.configuration.workspace })
  try {
    await processor.waitForEnd()
  } catch (e) {
    throw new Error(`error executing Markdown region: ${e}`)
  }
  action.log(processor.output.fullText())
  if (processor.exitCode !== 0) {
    throw new Error(
      `text-run exited with code ${processor.exitCode} when processing this markdown region:\n${stripAnsi(
        processor.output.fullText()
      )}`
    )
  }
}
