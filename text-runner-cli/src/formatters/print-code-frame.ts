import * as babel from "@babel/code-frame"
import * as fs from "fs"
import * as textRunner from "text-runner-core"

type PrintFunc = (arg: string) => void | boolean

export function printCodeFrame(output: PrintFunc, location: textRunner.files.Location | undefined): void {
  if (!location) {
    return
  }

  const fileContent = fs.readFileSync(location.absoluteFilePath().platformified(), "utf8")
  output(babel.codeFrameColumns(fileContent, { start: { line: location.line } }, { forceColor: true }))
}
