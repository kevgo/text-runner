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
  const actualOutput = CurrentCommand.instance().output.fullText()
  const actualLines = actualOutput
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
  console.log(actualLines)
  console.log(expectedLines)
  const commonLines = actualLines.filter((line) => expectedLines.includes(line))
  if (commonLines.length === 0) {
    throw new Error(`expected content not found in output:\n${actualOutput}`)
  }
  assertNoDiff.trimmedLines(expectedLines.join("\n"), commonLines.join("\n"))
}
