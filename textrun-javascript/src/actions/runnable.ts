import * as textRunner from "text-runner-core"

import { appendAsyncCallback } from "../helpers/append-async-callback.js"
import { hasCallbackPlaceholder } from "../helpers/has-callback-placeholder.js"
import { replaceAsyncCallback } from "../helpers/replace-async-callback.js"
import { replaceRequireLocalModule } from "../helpers/replace-require-local-module.js"
import { replaceVariableDeclarations } from "../helpers/replace-variable-declarations.js"

/** The "runJavascript" action runs the JavaScript code given in the code block. */
export function runnable(action: textRunner.actions.Args, done: textRunner.exports.DoneFunction): void {
  action.name("run JavaScript")
  let code = action.region.text()
  if (code === "") {
    done(new Error("no JavaScript code found"))
    return
  }
  code = replaceRequireLocalModule(code)
  code = replaceVariableDeclarations(code)

  // This is used in an eval'ed string below
  // @ts-ignore: unused variable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const __finished = done

  code = hasCallbackPlaceholder(code)
    ? replaceAsyncCallback(code) // async code
    : appendAsyncCallback(code) // sync code
  action.log(code)
  eval(code)
}
