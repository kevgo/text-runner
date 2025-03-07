import * as ast from "../ast/index.js"
import * as config from "../configuration/index.js"
import * as files from "../filesystem/index.js"
import * as linkTargets from "../link-targets/index.js"
import * as run from "../run/index.js"

export { Finder } from "./finder.js"
export * from "./name.js"

/** A user-defined or built-in function that tests an active block */
export type Action = (params: Args) => Result

export interface Args {
  /** TextRunner configuration data derived from the config file and CLI switches */
  readonly configuration: config.Data

  /** the AST nodes of the active region which the current action tests */
  readonly document: ast.NodeList

  /** all link targets in the current documentation  */
  readonly linkTargets: linkTargets.List

  /** name of the file in which the currently tested active region is */
  readonly location: files.Location

  /** allows printing test output to the user, behaves like console.log */
  readonly log: run.LogFn

  /**
   * Name allows to provide a more specific name for the current action.
   *
   * As an example, the generic step name `write file` could be refined to
   * `write file "foo.yml"` once the name of the file to be written
   * has been extracted from the document AST.
   */
  readonly name: run.RefineNameFn

  /** the AST nodes of the active region which the current action tests */
  readonly region: ast.NodeList

  /** return the action with this value to signal that it is being skipped */
  readonly SKIPPING: 254
}

export type FunctionRepo = Record<string, Action>

/** the result of an action function */
export type Result = 254 | undefined
