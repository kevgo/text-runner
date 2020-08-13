import * as child_process from "child_process"
import * as color from "colorette"
import * as os from "os"
import * as fs from "fs"
import { YarnReader, YarnInfo } from "./yarn-reader"
import { WorkspaceTagger } from "./workspace-tagger"

// learn workspace dependency info
const file = JSON.parse(child_process.execSync("yarn workspaces --silent info", { encoding: "utf-8" }))
const yarnInfo = new YarnReader(file)

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
  const downstreams = yarnInfo.downstreamsFor(workspace)
  for (const downstream of downstreams) {
    if (!taggedWorkspaces.isTagged(downstream)) {
      console.error(`${color.cyan(workspace)} is a downstream of ${color.cyan(downstream)}`)
    }
  }
  taggedWorkspaces.tagMany(downstreams)
}
const affectedWorkspaces = taggedWorkspaces.tagged()
console.error("all affected workspaces:", affectedWorkspaces)

// write to STDOUT
console.log(affectedWorkspaces.join(os.EOL))
