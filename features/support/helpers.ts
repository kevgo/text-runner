import path from "path"

export function makeFullPath(command: string) {
  if (/^text-run/.test(command)) {
    return command.replace(/^text-run/, fullTextRunPath())
  } else {
    return `${fullTextRunPath()} ${command}`
  }
}

export function fullTextRunPath() {
  let result = path.join(process.cwd(), "bin", "text-run")
  if (process.platform === "win32") {
    result += ".cmd"
  }
  return result
}
