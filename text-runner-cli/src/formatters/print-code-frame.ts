import * as babel from "@babel/code-frame"
import * as fs from "fs"
import * as tr from "text-runner-core"

type PrintFunc = (arg: string) => void | boolean

export function printCodeFrame(output: PrintFunc, location: tr.files.Location | undefined): void {
  if (!location) {
    return
  }

  const fileContent = fs.readFileSync(location.absoluteFile().platformified(), "utf8")
  output(babel.codeFrameColumns(fileContent, { start: { line: location.line } }, { forceColor: true }))
}
