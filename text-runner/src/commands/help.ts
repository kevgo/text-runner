import * as color from "colorette"

export async function helpCommand(error?: string) {
  console.log(template(error))
}

function template(error: string | undefined) {
  if (error) {
    error = `${color.red(color.bold("Error: " + error))}`
  }
  const { version } = require("../../package.json")

  return `
${color.dim("TextRunner " + version)}
${error || ""}
USAGE: ${color.bold("text-run [<options>] <command>")}

COMMANDS
  ${color.bold("run")} [<filename>]         runs all tests on the given file/folder or entire documentation
  ${color.bold("dynamic")} [<filename>]     runs only the programmatic tests, skips checking links
  ${color.bold("static")} [<filename>]      checks only the links, skips programmatic tests

  ${color.bold("setup")}                    creates an example configuration file
  ${color.bold("scaffold")} [--ts] <name>   scaffolds a new region type handler (--ts = in TypeScript)
  ${color.bold("unused")} <filename>        shows unused custom activities

  ${color.bold("help")}                     shows this help screen
  ${color.bold("version")}                  shows the currently installed version
  ${color.bold("debug")}                    shows debug data

OPTIONS
  ${color.bold("--config")}                 provide a custom configuration filename
  ${color.bold("--online")}                 check external links
`
}
