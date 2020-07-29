const { callArgs } = require("../textrun-shell/dist/helpers/call-args")
const { createObservableProcess } = require("observable-process")
const path = require("path")
const { RunningConsoleCommand } = require("../text-runner/dist/actions/helpers/running-console-command")

module.exports = async function runTextrun(args) {
  args.name("running the created Markdown file in TextRunner")

  var textRunPath = path.join(__dirname, "..", "src", "bin", "text-run")
  if (process.platform === "win32") textRunPath += ".cmd"
  const processor = createObservableProcess(callArgs(textRunPath), {
    cwd: args.configuration.workspace,
  })
  RunningConsoleCommand.set(processor)
  await processor.waitForEnd()
  if (processor.exitCode !== 0) {
    throw new Error(`text-run exited with code ${processor.exitCode} when processing the created Markdown file`)
  }
  global["consoleCommandOutput"] = processor.output.fullText()
}
