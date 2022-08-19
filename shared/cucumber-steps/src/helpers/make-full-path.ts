import * as path from "path"
import * as url from "url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

export function makeFullPath(command: string, platform: string): string {
  if (/^text-run/.test(command)) {
    return command.replace(/^text-run/, fullTextRunPath(platform))
  } else {
    return `${fullTextRunPath(platform)} ${command}`
  }
}

function fullTextRunPath(platform: string): string {
  let result = path.join(__dirname, "..", "..", "..", "..", "node_modules", ".bin", "text-run")
  if (platform === "win32") {
    result += ".cmd"
  }
  return result
}
