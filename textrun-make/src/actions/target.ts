import * as color from "colorette"
import { promises as fs } from "fs"
import * as textRunner from "text-runner-engine"

import { makefileTargets } from "../helpers/makefile-targets.js"

/** verifies that the Makefile in the sourceDir contains the enclosed target */
export async function target(action: textRunner.actions.Args): Promise<void> {
  const target = action.region.text().trim()
  if (target === "") {
    throw new Error("Empty make target")
  }
  action.name(`make target ${color.cyan(target)}`)
  const makePath = action.configuration.sourceDir.joinStr(action.region[0].attributes["dir"] || ".", "Makefile")
  const makefile = await fs.readFile(makePath, "utf8")
  const targets = makefileTargets(makefile)
  if (!targets.includes(target)) {
    throw new Error(
      `Makefile does not contain target ${color.cyan(target)} but these ones: ${color.cyan(targets.join(", "))}`
    )
  }
}
