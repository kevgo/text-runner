import { ActionArgs } from "text-runner"

type DoneFunction = (err?: Error) => void

/** The "runJavascript" action runs the JavaScript code given in the code block. */
export function run(args: ActionArgs, done: DoneFunction) {
  let code = args.nodes.text()
  if (code === "") {
    done(new Error("no JavaScript code found"))
    return
  }
  code = replaceRequireLocalModule(code)
  code = replaceVariableDeclarations(code)

  // This is used in an eval'ed string below
  // @ts-ignore: unused variable
  // TODO: simplify to = done
  const __finished = (err: any) => {
    done(err)
  }

  // TODO: change to normal if clause
  code = hasCallbackPlaceholder(code)
    ? replaceAsyncCallbacks(code) // async code
    : appendAsyncCallback(code) // sync code
  eval(code)
}

function appendAsyncCallback(code: string): string {
  return `${code.trim()};\n__finished()`
}

function replaceAsyncCallbacks(code: string): string {
  return code.replace("<CALLBACK>", "__finished").replace(/\/\/\s*\.\.\./g, "__finished()")
}

/** replaceRequireLocalModule makes sure "require('.') works as expected even if running in a temp workspace. */
function replaceRequireLocalModule(code: string): string {
  return code.replace(/require\(['"].['"]\)/, "require(process.cwd())")
}

/** replaceVariableDeclarations makes variable declarations persist across code blocks. */
function replaceVariableDeclarations(code: string): string {
  return code
    .replace(/\bconst /g, "global.")
    .replace(/\bvar /g, "global.")
    .replace(/\bthis\./g, "global.")
}

/** hasCallbackPlaceholder returns whether the given code block contains a callback placeholder. */
function hasCallbackPlaceholder(code: string): boolean {
  return code.indexOf("<CALLBACK>") > -1 || code.indexOf("// ...") > -1
}
