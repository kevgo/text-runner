const callArgs = require("../dist/helpers/call-args").default
const { ObservableProcess } = require("observable-process")
const path = require("path")
const RunningConsoleCommand = require("../dist/actions/helpers/running-console-command")
  .default

module.exports = async function(args) {
  args.formatter.name("running the created Markdown file in TextRunner")

  var textRunPath = path.join(__dirname, "..", "bin", "text-run")
  if (process.platform === "win32") textRunPath += ".cmd"
  const processor = new ObservableProcess({
    commands: callArgs(textRunPath),
    cwd: args.configuration.workspace,
    stdout: args.formatter.stdout,
    stderr: args.formatter.stderr
  })
  RunningConsoleCommand.set(processor)
  await processor.waitForEnd()
  if (processor.exitCode !== 0) {
    args.formatter.error(
      `text-run exited with code ${
        processor.exitCode
      } when processing the created Markdown file`
    )
  }
  global.consoleCommandOutput = processor.fullOutput()
}
