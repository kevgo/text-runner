import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openNode = openTags.popType('list_item_open', file, line)
  result.pushNode({
    attributes: openNode.attributes,
    content: '',
    file,
    line,
    tag: '/li',
    type: node.type
  })
  return result
}
