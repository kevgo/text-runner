import * as assertNoDiff from "assert-no-diff"
import { CurrentCommand } from "../helpers/current-command"
import { ActionArgs } from "text-runner"

export function execOutput(args: ActionArgs) {
  args.name("verifying the output of the last run console command")

  const expectedLines = args.nodes
    .text()
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line)
  const actualLines = CurrentCommand.instance()
    .output.fullText()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
  const commonLines = actualLines.filter((line) => expectedLines.includes(line))
  assertNoDiff.trimmedLines(expectedLines.join("\n"), commonLines.join("\n"))
}
