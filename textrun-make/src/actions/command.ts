import * as color from "colorette"
import { promises as fs } from "fs"
import * as os from "os"
import * as tr from "text-runner-core"

import { makefileTargets } from "../helpers/makefile-targets"

/** verifies that the Makefile in the sourceDir contains the enclosed target */
export async function command(action: tr.actions.Args): Promise<void> {
  const wants = getMakeTargets(action.region.text())
  if (wants.length === 0) {
    throw new tr.UserError("No Make commands found", `Make commands must start with "make"`, action.location)
  } else if (wants.length === 1) {
    action.name(`make command: ${color.cyan(wants[0])}`)
  } else {
    action.name(`make commands: ${color.cyan(wants.join(", "))}`)
  }

  const makefilePath = action.configuration.sourceDir.joinStr(
    action.location.file.directory().platformified(),
    action.region[0].attributes["dir"] || ".",
    "Makefile"
  )
  const makefileContent = await fs.readFile(makefilePath, "utf8")
  const haves = makefileTargets(makefileContent)
  for (const want of wants) {
    if (!haves.includes(want)) {
      throw new Error(
        `Makefile does not contain command make ${color.cyan(want)} but these targets: ${color.cyan(haves.join(", "))}`
      )
    }
  }
}

export function getMakeTargets(code: string): string[] {
  const result: string[] = []
  for (let line of code.split(os.EOL)) {
    line = trimDollar(line.trim())
    if (line.startsWith("make ")) {
      result.push(line.substring(5).trim())
    }
  }
  return result
}

/** trims the leading dollar from the given command */
export function trimDollar(text: string): string {
  return text.replace(/^\$?\s*/, "")
}
