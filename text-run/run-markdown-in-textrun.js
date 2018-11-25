const callArgs = require("../dist/helpers/call-args").default
const fs = require("fs")
const { ObservableProcess } = require("observable-process")
const path = require("path")
const debug = require("debug")("text-runner:run-markdown-in-text-run")

module.exports = async function(args) {
  args.formatter.name("verify the inline markdown works in TextRunner")
  const filePath = path.join(args.configuration.workspace, "1.md")
  const markdown = args.nodes.textInNodeOfType("fence")
  const fileContent = markdown.replace(/​/g, "")
  debug(`writing file '${filePath}' with content:`)
  debug(fileContent)
  fs.writeFileSync(filePath, fileContent)

  var textRunPath = path.join(args.configuration.sourceDir, "bin", "text-run")
  if (process.platform === "win32") textRunPath += ".cmd"
  const trArgs = callArgs(textRunPath)
  trArgs[trArgs.length - 1] += ` --keep-tmp --workspace ${
    args.configuration.workspace
  }`
  const processor = new ObservableProcess({
    commands: trArgs,
    cwd: args.configuration.workspace,
    stdout: args.formatter.stdout,
    stderr: args.formatter.stderr
  })
  await processor.waitForEnd()
  debug(processor.fullOutput())
  if (processor.exitCode !== 0) {
    throw new Error(
      `text-run exited with code ${
        processor.exitCode
      } when processing this markdown block.`
    )
  }
}
