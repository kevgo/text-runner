import * as path from "path"

export function makeFullPath(command: string, platform: string): string {
  if (/^text-run/.test(command)) {
    return command.replace(/^text-run/, fullTextRunPath(platform))
  } else {
    return `${fullTextRunPath(platform)} ${command}`
  }
}

function fullTextRunPath(platform: string): string {
  let result = path.join(__dirname, "..", "..", "..", "..", "text-runner-cli", "bin", "text-run")
  if (platform === "win32") {
    result += ".cmd"
  }
  return result
}
