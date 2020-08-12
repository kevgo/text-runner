import * as child_process from "child_process"
import * as path from "path"
import * as os from "os"
import * as fs from "fs"

// determine changed workspaces
const changed = rootFolders(filesInInput())
console.log("FOLDERS WITH CHANGES:", changed)

// determine the upstream workspaces of all changed folders
const depInfo = workspaceInfo()
const upstreams = new Set<string>()
for (const folder of changed) {
  addDeps(folder)
}
console.log("FOLDERS TO TEST:", upstreams)

/** Adds all upstream dependencies for the given folder to the global `upstreams` object. */
function addDeps(folder: string) {
  if (upstreams[folder] !== undefined) {
    return
  }
  const folderDeps = upstreamDependencies(folder, depInfo)
  upstreams.add(folder)
  for (const folderDep of folderDeps) {
    addDeps(folderDep)
  }
}

/** provides the files provided via STDIN */
function filesInInput(): string[] {
  return fs.readFileSync(0, "utf-8").split(os.EOL)
}

/** provides the top-level folders containing the given list of filenames */
function rootFolders(files: string[]): string[] {
  const set = new Set<string>()
  for (const file of files) {
    set.add(path.dirname(file).split(path.sep)[0])
  }
  return Array.from(set).sort()
}

/** Executes the given shell command. */
function shell(cmd: string): string {
  return child_process.execSync(cmd, { encoding: "utf-8" })
}

/** Provides the upstream dependencies of the given workspace folder. */
function upstreamDependencies(folder: string, deps: any): string[] {
  const result: string[] = []
  for (const key of Object.keys(deps)) {
    if (deps[key].workspaceDependencies.includes(folder)) {
      console.log(`${key} USES ${folder}`)
      result.push(key)
      result.push(...upstreamDependencies(key, deps))
    }
  }
  return result
}

/** Loads Yarn workspace information */
function workspaceInfo(): any {
  const depText = shell("yarn workspaces --silent info")
  return JSON.parse(depText)
}
