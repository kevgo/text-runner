import AbsoluteFilePath from '../../../../domain-model/absolute-file-path.js'
import AstNodeList from '../../../ast-node-list.js'
import OpenTagTracker from '../../helpers/open-tag-tracker.js'

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  result.pushNode({
    type: 'code_open',
    tag: 'code',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  result.pushNode({
    type: 'text',
    tag: '',
    file: file,
    line,
    content: node.content,
    attributes: {}
  })
  result.pushNode({
    type: 'code_close',
    tag: '/code',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  return result
}
