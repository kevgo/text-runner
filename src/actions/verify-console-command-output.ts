import { ActionArgs } from "../runners/action-args.js"

import jsdiffConsole from "jsdiff-console"

export default function(args: ActionArgs) {
  args.formatter.name("verifying the output of the last run console command")

  const expectedLines = args.nodes
    .text()
    .split("\n")
    .map(line => line.trim())
    .filter(line => line)

  const actualLines = global.consoleCommandOutput
    .split("\n")
    .map(line => line.trim())
    .filter(line => line)

  const commonLines = actualLines.filter(line => expectedLines.includes(line))
  jsdiffConsole(expectedLines, commonLines)
}
