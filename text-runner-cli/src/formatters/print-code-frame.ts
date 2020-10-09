import * as babel from "@babel/code-frame"
import * as fs from "fs"

type PrintFunc = (arg: string) => void | boolean

export function printCodeFrame(output: PrintFunc, filename: string | undefined, line: number | undefined): void {
  if (!filename || line == null) {
    return
  }

  const fileContent = fs.readFileSync(filename, "utf8")
  output(babel.codeFrameColumns(fileContent, { start: { line } }, { forceColor: true }))
}
