import * as assertNoDiff from "assert-no-diff"
import { ActionArgs } from "../runners/action-args"
import { RunningConsoleCommand } from "./helpers/running-console-command"

export default function verifyConsoleCommandOutput(args: ActionArgs) {
  args.formatter.name("verifying the output of the last run console command")

  const expectedLines = args.nodes
    .text()
    .split("\n")
    .map(line => line.trim())
    .filter(line => line)

  const actualLines = RunningConsoleCommand.instance()
    .fullOutput()
    .split("\n")
    .map(line => line.trim())
    .filter(line => line)

  const commonLines = actualLines.filter(line => expectedLines.includes(line))
  assertNoDiff.trimmedLines(expectedLines.join("\n"), commonLines.join("\n"))
}
