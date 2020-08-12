import * as child_process from "child_process"
import * as path from "path"
import * as os from "os"

function shell(cmd: string): string {
  return child_process.execSync(cmd, { encoding: "utf-8" })
}

// determine changed folders
const changedFolderSet = new Set<string>(
  shell("git diff --name-only")
    .split(os.EOL)
    .map((filename: string) => path.dirname(filename))
    .map((dirname) => dirname.split(path.sep)[0])
)
const changedFolders = Array.from(changedFolderSet).sort()
console.log("CHANGED FOLDERS:", changedFolders)

// determine downstream dependencies of all changed folders
const depText = shell("yarn workspaces --silent info")
const depJson = JSON.parse(depText)
const deps: string[] = []
for (const changed of changedFolders) {
  deps.push(...upstreamDependencies(changed, depJson))
}
console.log(deps)

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
