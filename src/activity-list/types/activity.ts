import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNodeList } from "../../parsers/standard-AST/ast-node-list"

/**
 * Activity is an action instance.
 * A particular action that we are going to perform
 * on a particular region of a particular document.
 */
export interface Activity {
  actionName: string
  file: AbsoluteFilePath
  line: number
  nodes: AstNodeList
}

/** scaffoldActivity creates a test Activity from the given data */
export function scaffoldActivity(data: { actionName?: string }): Activity {
  return {
    actionName: data.actionName || "foo",
    file: new AbsoluteFilePath("file"),
    line: 0,
    nodes: new AstNodeList(),
  }
}
