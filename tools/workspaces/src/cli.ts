import * as child_process from "child_process"
import * as minimist from "minimist"
import { affected } from "./affected"
import { changed } from "./changed"

function noLog(message?: any, ...optionalParams: any[]) {}

const yarnOutput = JSON.parse(child_process.execSync("yarn workspaces --silent info", { encoding: "utf-8" }))
const args = minimist(process.argv.slice(2))
const log = args.log ? console.error : noLog
if (args._.length === 0) {
  console.error("Error: please provide a command to run")
  printHelp()
  process.exit(1)
}
if (args._.length > 1) {
  console.error("Error: too many commands provided")
  printHelp()
  process.exit(1)
}
switch (args._[0]) {
  case "affected":
    affected(yarnOutput, log)
    break
  case "changed":
    changed(yarnOutput, log)
    break
  default:
    console.error("Error: unknown command:", args._[0])
    printHelp()
    process.exit(1)
}

function printHelp() {
  console.error(`
Usage: warkspaces <provided|affected> [--log]

Commands:
- changed: provides only the workspaces that contain the provided files
- affected: provides all affected workspaces: changed + their downstream dependencies

Flags:
- log: print additional information on STDERR
`)
}
