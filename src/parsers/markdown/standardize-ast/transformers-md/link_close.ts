import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  // TODO: remove openTags, since MD nodes never have attributes
  const openNode = openTags.popType('link_open', file, line)
  const result = new AstNodeList()
  result.pushNode({
    attributes: openNode.attributes,
    content: '',
    file,
    line,
    tag: '/a',
    type: node.type
  })
  return result
}
