import color from "colorette"
import fs from "fs-extra"
import path from "path"
import { ActionArgs } from "text-runner"
import { makefileTargets } from "../helpers/makefile-targets"

/** verifies that the Makefile in the sourceDir contains the enclosed target */
export async function target(args: ActionArgs) {
  const target = args.nodes.text().trim()
  args.name(`make target ${color.cyan(target)} exists`)
  const makefile = await fs.readFile(path.join(args.configuration.sourceDir, "Makefile"), "utf8")
  const targets = makefileTargets(makefile)
  if (!targets.includes(target)) {
    throw new Error(
      `Makefile does not contain target ${color.cyan(target)} but these ones: ${color.cyan(targets.join(", "))}`
    )
  }
}
