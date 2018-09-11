import AbsoluteFilePath from "../domain-model/absolute-file-path.js"
import AstNodeList from "../parsers/ast-node-list.js"

// Activity is an action instance, i.e. a particular activity that we are going to do
// on a particular place in a particular document, defined by an action
export interface Activity {
  type: string
  file: AbsoluteFilePath
  line: number
  nodes: AstNodeList
}
