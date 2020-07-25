import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { trimDollar } from "../text-runner/src/actions/helpers/trim-dollar"
import { ActionArgs } from "../text-runner/src/actions/types/action-args"

export default async function verifyNpmInstall(args: ActionArgs) {
  const installText = trimDollar(args.nodes.text())
  const packageJsonPath = path.join(args.configuration.sourceDir, "src", "package.json")
  const pkg = await fs.readJSON(packageJsonPath)
  if (!pkg) {
    throw new Error(`cannot find ${packageJsonPath}`)
  }
  args.name(`verify NPM installs ${color.cyan(pkg.name)}`)

  if (missesPackageName(installText, pkg.name)) {
    throw new Error(`could not find ${color.cyan(pkg.name)} in installation instructions`)
  }
}

function missesPackageName(installText: string, packageName: string): boolean {
  // Note: cannot use minimist here
  //       because it is too stupid to understand
  //       that NPM uses '-g' by itself, and not as a switch for the argument after it
  return (
    installText
      .split(" ")
      .map((word) => word.trim())
      .filter((word) => word === packageName).length === 0
  )
}
