import * as color from "colorette"
import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"

import { makefileTargets } from "../helpers/makefile-targets"

/** verifies that the Makefile in the sourceDir contains the enclosed target */
export async function target(action: tr.actions.Args): Promise<void> {
  const target = action.region.text().trim()
  if (target === "") {
    throw new Error("Empty make target")
  }
  action.name(`make target ${color.cyan(target)}`)
  const makefile = await fs.readFile(path.join(action.configuration.sourceDir, "Makefile"), "utf8")
  const targets = makefileTargets(makefile)
  if (!targets.includes(target)) {
    throw new Error(
      `Makefile does not contain target ${color.cyan(target)} but these ones: ${color.cyan(targets.join(", "))}`
    )
  }
}
