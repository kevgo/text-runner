import { promises as fs } from "fs"
import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

import { makefileTargets } from "../helpers/makefile-targets.js"

/** verifies that the Makefile in the sourceDir contains the enclosed target */
export async function target(action: textRunner.actions.Args): Promise<void> {
  const target = action.region.text().trim()
  if (target === "") {
    throw new Error("Empty make target")
  }
  action.name(`make target ${styleText("cyan", target)}`)
  const makePath = action.configuration.sourceDir.joinStr(action.region[0].attributes["dir"] || ".", "Makefile")
  const makefile = await fs.readFile(makePath, "utf8")
  const targets = makefileTargets(makefile)
  if (!targets.includes(target)) {
    throw new Error(
      `Makefile does not contain target ${styleText("cyan", target)} but these ones: ${
        styleText("cyan", targets.join(", "))
      }`
    )
  }
}
