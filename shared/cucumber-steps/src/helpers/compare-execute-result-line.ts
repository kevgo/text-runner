import { ExecuteResultLine } from "../then-steps"

export function compareExecuteResultLine(a: ExecuteResultLine, b: ExecuteResultLine): number {
  if (!a.filename || !b.filename || !a.line || !b.line) {
    return 0
  }
  if (a.filename > b.filename) {
    return 1
  } else if (a.filename < b.filename) {
    return -1
  } else {
    return a.line - b.line
  }
}
