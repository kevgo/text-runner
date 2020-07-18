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

export function standardizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/")
}

/**
 * Returns the command that runs the given command with test coverage
 */
export function runWithTestCoverage(command: string) {
  return path.join(process.cwd(), "node_modules", ".bin", "nyc") + " " + command
}
