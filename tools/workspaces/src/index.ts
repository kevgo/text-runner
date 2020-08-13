import * as child_process from "child_process"
import * as color from "colorette"
import * as os from "os"
import * as fs from "fs"
import { YarnInfo } from "./yarn-info"
import { WorkspaceTagger } from "./workspace-tagger"

// learn workspace dependency info
const yarnInfo = new YarnInfo(workspaceInfo())

// determine the provided workspaces
const files = fs.readFileSync(0, "utf-8").split(os.EOL)
const taggedWorkspaces = new WorkspaceTagger(yarnInfo.workspaces())
for (const file of files) {
  const workspace = taggedWorkspaces.getWorkspace(file)
  taggedWorkspaces.tag(workspace)
}
const providedWorkspaces = taggedWorkspaces.tagged()
console.error("changed workspaces:", providedWorkspaces)

// determine all affected workspaces
for (const workspace of providedWorkspaces) {
  const upstreams = yarnInfo.upstreamsFor(workspace)
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
function workspaceInfo(): Map<string, string[]> {
  const result = new Map()
  const yarnInfo = JSON.parse(child_process.execSync("yarn workspaces --silent info", { encoding: "utf-8" }))
  for (const key of Object.keys(yarnInfo)) {
    result.set(yarnInfo[key].location, yarnInfo[key].workspaceDependencies)
  }
  return result
}
