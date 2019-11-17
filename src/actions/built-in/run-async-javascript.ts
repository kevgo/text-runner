import { Configuration } from "../../configuration/types/configuration"
import { ActionArgs } from "../types/action-args"

// Runs the async-await JavaScript code given in the code block
export default function runAsyncJavascript(args: ActionArgs) {
  args.name("run async javascript")
  let code = args.nodes.textInNodeOfType("fence")
  if (code == null) {
    throw new Error("no JavaScript code found in the fenced block")
  }
  code = replaceSubstitutions(code, args.configuration)
  code = replaceRequireLocalModule(code)
  code = replaceVariableDeclarations(code)
  code = wrapInAsyncFunction(code)
  args.log(code)
  eval(code)
}

function wrapInAsyncFunction(code: string) {
  return `(async function() {
  ${code}
})()`
}

// substitutes replacements configured in text-run.yml
function replaceSubstitutions(code: string, c: Configuration): string {
  // TODO: absorb null here
  for (const replaceData of c.actions.runJavascript.replace) {
    code = code.replace(replaceData.search, replaceData.replace)
  }
  return code
}

// makes sure "require('.') works as expected even if running in a temp workspace
function replaceRequireLocalModule(code: string): string {
  return code.replace(/require\(['"].['"]\)/, "require(process.cwd())")
}

// make variable declarations persist across code blocks
function replaceVariableDeclarations(code: string): string {
  return code
    .replace(/\bconst /g, "global.")
    .replace(/\bvar /g, "global.")
    .replace(/\bthis\./g, "global.")
}
