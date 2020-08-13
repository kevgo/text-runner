import * as child_process from "child_process"
import { workspaces } from "./workspaces"

function noLog(message?: any, ...optionalParams: any[]) {}

const yarnOutput = JSON.parse(child_process.execSync("yarn workspaces --silent info", { encoding: "utf-8" }))
const param = process.argv[process.argv.length - 1]
const log = param === "--log" ? console.error : noLog
workspaces(yarnOutput, log)
