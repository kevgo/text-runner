import * as path from "path"

export function fullTextRunPath(platform: string) {
  let result = path.join(__dirname, "..", "..", "..", "..", "text-runner", "bin", "text-run")
  if (platform === "win32") {
    result += ".cmd"
  }
  return result
}

// TODO: merge with fullTextRunPath above
export function globalTextRunPath(platform: string) {
  let result = path.join(__dirname, "..", "..", "..", "..", "text-runner", "bin", "text-run")
  if (platform === "win32") {
    result += ".cmd"
  }
  return result
}

export function makeFullPath(command: string, platform: string) {
  if (/^text-run/.test(command)) {
    return command.replace(/^text-run/, fullTextRunPath(platform))
  } else {
    return `${fullTextRunPath(platform)} ${command}`
  }
}

export function standardizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/")
}
