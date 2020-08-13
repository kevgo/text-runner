import * as child_process from "child_process"
import * as color from "colorette"
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
console.error("changed workspaces:", providedWorkspaces)

// determine all affected workspaces
for (const workspace of providedWorkspaces) {
  const upstreams = upstreamInfo.upstreamsFor(workspace)
  for (const upstream of upstreams) {
    if (!taggedWorkspaces.isTagged(upstream)) {
      console.error(`${color.cyan(workspace)} is an upstream of ${color.cyan(upstream)}`)
    }
  }
  taggedWorkspaces.tagMany(upstreams)
}
const affectedWorkspaces = taggedWorkspaces.tagged()
console.error("all affected workspaces:", affectedWorkspaces)

// write to STDOUT
console.log(affectedWorkspaces.join(os.EOL))

/** Loads Yarn workspace information */
function workspaceInfo(): any {
  return JSON.parse(child_process.execSync("yarn workspaces --silent info", { encoding: "utf-8" }))
}
