import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import AstNode from '../../../ast-node'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const resultNode = new AstNode({
    attributes: {
      href: node.href,
      title: node.title
    },
    content: '',
    file,
    line,
    tag: 'a',
    type: node.type
  })
  openTags.add(resultNode)
  result.push(resultNode)
  return result
}
