import { AbsoluteFilePath } from '../domain-model/absolute-file-path'
import { AstNodeList } from '../parsers/ast-node-list'

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
