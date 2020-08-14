import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "text-runner"
import { makefileTargets } from "../helpers/makefile-targets"

/** verifies that the Makefile in the sourceDir contains the enclosed target */
export async function command(action: ActionArgs) {
  const command = action.nodes.text().trim()
  if (command === "") {
    throw new Error("No make command found")
  }
  if (!command.startsWith("make ")) {
    throw new Error('Make command must start with "make "')
  }
  action.name(`make command: ${color.cyan(command)}`)
  const target = command.substring(5).trim()
  if (target === "") {
    throw new Error(`No make target found in "${command}"`)
  }
  const makefile = await fs.readFile(path.join(action.configuration.sourceDir, "Makefile"), "utf8")
  const commands = makefileTargets(makefile).map((target: string) => `make ${target}`)
  if (!commands.includes(command)) {
    throw new Error(
      `Makefile does not contain target ${color.cyan(command)} but these ones: ${color.cyan(commands.join(", "))}`
    )
  }
}
