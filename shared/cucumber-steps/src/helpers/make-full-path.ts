import * as path from "path"
import * as url from "url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

export function makeFullPath(command: string, platform: string): string {
  if (/^text-runner/.test(command)) {
    return command.replace(/^text-runner/, fullTextRunPath(platform))
  } else {
    return `${fullTextRunPath(platform)} ${command}`
  }
}

function fullTextRunPath(platform: string): string {
  let result = path.join(__dirname, "..", "..", "..", "..", "node_modules", ".bin", "text-runner")
  if (platform === "win32") {
    result += ".cmd"
  }
  return result
}
