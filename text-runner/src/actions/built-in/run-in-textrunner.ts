import { ActionArgs } from "../types/action-args"
import { promises as fs } from "fs"
import tmp from "tmp"
import util from "util"
import path from "path"
import { callArgs } from "../helpers/call-args"
import { createObservableProcess } from "observable-process"
import stripAnsi from "strip-ansi"
const tmpDir = util.promisify(tmp.dir)

/** runs the given Markdown in Text-Runner */
export default async function runInTextRunner(action: ActionArgs) {
  const content = action.nodes.text()
  // TODO: call an internal Text-Runner API here, see https://github.com/kevgo/text-runner/issues/903
  const dir = await tmpDir()
  await fs.writeFile(path.join(dir, "1.md"), content)
  // TODO: call existing Text-Runner API here
  var textRunPath = path.join(action.configuration.sourceDir, "..", "text-runner", "bin", "text-run")
  if (process.platform === "win32") textRunPath += ".cmd"
  const trArgs = callArgs(textRunPath)
  trArgs[trArgs.length - 1] += ` --keep-tmp --workspace ${dir}`
  const processor = createObservableProcess(trArgs, { cwd: dir })
  await processor.waitForEnd()
  if (processor.exitCode !== 0) {
    throw new Error(
      `text-run exited with code ${processor.exitCode} when processing this markdown block:\n${stripAnsi(
        processor.output.fullText()
      )}`
    )
  }
  // fs.rmdir(dir, { recursive: true })
}
