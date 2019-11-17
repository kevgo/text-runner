import { ActionArgs } from "../types/action-args"

/** The "validateJavascript" action cherks the given JavaScript code for syntax errors. */
export default function validateJavascript(args: ActionArgs) {
  const code = args.nodes.textInNodeOfType("fence")
  args.log(code)
  try {
    new Function(code)
  } catch (e) {
    throw new Error(`invalid Javascript: ${e.message}`)
  }
}
