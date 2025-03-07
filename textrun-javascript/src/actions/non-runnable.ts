import * as textRunner from "text-runner-engine"

/** checks the given JavaScript code for syntax errors. */
export function nonRunnable(action: textRunner.actions.Args): void {
  const code = action.region.text().trim()
  if (code.length === 0) {
    throw new Error("no JavaScript code found")
  }
  try {
    new Function(code)
  } catch (e) {
    throw new Error(`invalid Javascript: ${textRunner.errorMessage(e)}`)
  }
}
