import * as assertNoDiff from "assert-no-diff"
import stripAnsi from "strip-ansi"
import * as textRunner from "text-runner-core"

import { CurrentCommand } from "../helpers/current-command.js"

export function commandOutput(action: textRunner.actions.Args): void {
  action.name("verifying the output of the last run console command")
  const expectedText = action.region.text()
  const expectedLines = expectedText
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line)
  const actualOutput = stripAnsi(CurrentCommand.instance().combinedText)
  const actualLines = actualOutput
    .split("\n")
    .map(line => line.trim())
    .filter(line => line)
  const commonLines = actualLines.filter(line => expectedLines.includes(line))
  if (commonLines.length === 0) {
    throw new Error(`expected content not found: "${expectedText}"\nThis is the output I found:\n${actualOutput}`)
  }
  assertNoDiff.trimmedLines(expectedLines.join("\n"), commonLines.join("\n"))
}
