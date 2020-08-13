import * as child_process from "child_process"
import { workspaces } from "./workspaces"
import * as minimist from "minimist"

function noLog(message?: any, ...optionalParams: any[]) {}

const yarnOutput = JSON.parse(child_process.execSync("yarn workspaces --silent info", { encoding: "utf-8" }))
const args = minimist(process.argv.slice(2))
const log = args.log ? console.error : noLog
workspaces(yarnOutput, log)
