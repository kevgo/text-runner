import chalk from "chalk"

export default (async function helpCommand(error?: string) {
  console.log(template(error))
})

function template(error: string | undefined) {
  if (error) {
    error = `${chalk.red(chalk.bold("Error: " + error))}`
  }
  const { version } = require("../../package.json")

  return `
${chalk.dim("TextRunner " + version)}
${error || ""}
USAGE: ${chalk.bold("text-run [<options>] <command>")}

COMMANDS
  ${chalk.bold(
    "run"
  )} [<filename>]  tests the entire documentation, or only the given file/folder
  ${chalk.bold("add")} <filename>    scaffolds a new block type handler
  ${chalk.bold("setup")}             creates an example configuration file
  ${chalk.bold("version")}           shows the currently installed version
  ${chalk.bold("help")}              shows this help screen

OPTIONS
  ${chalk.bold("--config")}          provide a custom configuration filename
  ${chalk.bold("--offline")}         don't check external links
`
}
