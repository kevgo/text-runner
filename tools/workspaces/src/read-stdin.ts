import * as fs from "fs"
import * as os from "os"

/** Provides the incoming UNIX text stream */
export function readStdin(): string[] {
  return fs.readFileSync(0, "utf-8").split(os.EOL)
}
