import * as child_process from "child_process"
import * as os from "os"
import * as fs from "fs"
import { UpstreamInfo } from "./upstream-collector"
import { WorkspaceTagger } from "./workspace-tagger"
import { rootFolder } from "./root-folder"

// learn workspace dependency info
const depInfo = workspaceInfo()
const allWorkspaces = Object.keys(depInfo)
const upstreamInfo = new UpstreamInfo(allWorkspaces)
for (const workspace of Object.keys(depInfo)) {
  upstreamInfo.registerDownstreams(workspace, depInfo[workspace].workspaceDependencies)
}

// determine the provided workspaces
const files = fs.readFileSync(0, "utf-8").split(os.EOL)
const taggedWorkspaces = new WorkspaceTagger(allWorkspaces)
for (const file of files) {
  taggedWorkspaces.tag(rootFolder(file))
}
const providedWorkspaces = taggedWorkspaces.tagged()
console.error("PROVIDED WORKSPACES:", providedWorkspaces)

// determine all affected workspaces
for (const workspace of providedWorkspaces) {
  taggedWorkspaces.tagMany(upstreamInfo.upstreamsFor(workspace))
}
const affectedWorkspaces = taggedWorkspaces.tagged()
console.error("AFFECTED WORKSPACES:", affectedWorkspaces)

// write to STDOUT
console.log(affectedWorkspaces.join(os.EOL))

/** Loads Yarn workspace information */
function workspaceInfo(): any {
  return JSON.parse(child_process.execSync("yarn workspaces --silent info", { encoding: "utf-8" }))
}
