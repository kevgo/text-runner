import color from "colorette"
import jsonfile from "jsonfile"
import path from "path"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs } from "../types/action-args"

export default async function verifyNpmInstall(args: ActionArgs) {
  const installText = trimDollar(args.nodes.textInNodeOfType("fence", "code"))
  const pkg = await jsonfile.readFile(
    path.join(args.configuration.sourceDir, "package.json")
  )
  args.name(`verify NPM installs ${color.cyan(pkg.name)}`)

  if (missesPackageName(installText, pkg.name)) {
    throw new Error(
      `could not find ${color.cyan(pkg.name)} in installation instructions`
    )
  }
}

function missesPackageName(installText: string, packageName: string): boolean {
  // Note: cannot use minimist here
  //       because it is too stupid to understand
  //       that NPM uses '-g' by itself, and not as a switch for the argument after it
  return (
    installText
      .split(" ")
      .map(word => word.trim())
      .filter(word => word === packageName).length === 0
  )
}
