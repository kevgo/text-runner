import path from "path"

export function fullTextRunPath(platform: string) {
  let result = path.join(__dirname, "..", "..", "bin", "text-run")
  if (platform === "win32") {
    result += ".cmd"
  }
  return result
}

export function globalTextRunPath(platform: string) {
  let result = path.join(__dirname, "..", "..", "bin", "text-run")
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

/**
 * Returns the command that runs the given command with test coverage
 */
export function coverageCommand(command: string) {
  return path.join(process.cwd(), "node_modules", ".bin", "nyc") + " " + command
}
