import * as child_process from "child_process"
import * as path from "path"
import * as os from "os"

// determine changed folders
const changed = changedFolders()
console.log("CHANGED FOLDERS:", changed)

// determine upstream dependencies of all changed folders
const depInfo = loadDeps()
const upstreams = new Set<string>()
for (const folder of changed) {
  addDeps(folder)
}
console.log("FOLDERS TO TEST:", upstreams)

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

function changedFolders(): string[] {
  const set = new Set<string>(
    shell("git diff --name-only")
      .split(os.EOL)
      .map((filename: string) => path.dirname(filename))
      .map((dirname) => dirname.split(path.sep)[0])
  )
  return Array.from(set).sort()
}

function loadDeps(): any {
  const depText = shell("yarn workspaces --silent info")
  return JSON.parse(depText)
}

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

function shell(cmd: string): string {
  return child_process.execSync(cmd, { encoding: "utf-8" })
}
