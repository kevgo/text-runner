import { Configuration } from "../configuration/configuration"
import { LinkTargetList } from "../link-targets/link-target-list"
import { AstNodeList } from "../parsers/ast-node-list"

export interface ActionArgs {
  /** TextRunner configuration data derived from the config file and CLI switches */
  configuration: Configuration

  /** the AST nodes of the active region which the current action tests */
  nodes: AstNodeList

  /** name of the file in which the currently tested active region is */
  file: string

  /** line in the current file at which the currently tested active region starts */
  line: number

  /** allows printing test output to the user, behaves like console.log */
  log: (text: string) => void

  /**
   * Name allows to provide a more specific name for the current action.
   *
   * As an example, the generic step name `write file` could be refined to
   * `write file "foo.yml"` once the name of the file to be written
   * has been extracted from the document AST.
   */
  name: (newName: string) => void

  /** all link targets in the current documentation  */
  linkTargets: LinkTargetList

  /** return the action with this value to signal that it is being skipped */
  SKIPPING: 1
}
