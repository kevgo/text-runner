import * as assertNoDiff from "assert-no-diff"
import { CurrentCommand } from "../helpers/current-command"
import { ActionArgs } from "text-runner"

export function execOutput(action: ActionArgs) {
  action.name("verifying the output of the last run console command")
  const expectedText = action.nodes.text()
  const expectedLines = expectedText
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line)
  const actualOutput = CurrentCommand.instance().output.fullText()
  const actualLines = actualOutput
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
  const commonLines = actualLines.filter((line) => expectedLines.includes(line))
  if (commonLines.length === 0) {
    throw new Error(`expected content not found: ${expectedText}\nThis is the output I found:\n${actualOutput}`)
  }
  assertNoDiff.trimmedLines(expectedLines.join("\n"), commonLines.join("\n"))
}
