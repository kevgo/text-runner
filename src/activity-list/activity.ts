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

// scaffoldActivity creates a test Activity from the given data.
export function scaffoldActivity(data: {
  actionName?: string
  nodes?: AstNodeList
  file?: string
  line?: number
}): Activity {
  return {
    actionName: data.actionName || 'foo',
    file: new AbsoluteFilePath(data.file || 'file'),
    line: data.line || 0,
    nodes: data.nodes || new AstNodeList()
  }
}
