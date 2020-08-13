import * as os from "os"

/** provides the given content as a UNIX text stream to the next application in the pipeline */
export function writeStdout(lines: string[]) {
  console.log(lines.join(os.EOL))
}
