import { AbsoluteFilePath } from '../../../../domain-model/absolute-file-path'
import { pretendToUse } from '../../../../helpers/pretend-to-use'
import { AstNodeList } from '../../../ast-node-list'
import { OpenTagTracker } from '../../helpers/open-tag-tracker'
import { RemarkableNode } from '../remarkable-node'

export default function(
  node: RemarkableNode,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  result.pushNode({
    attributes: {},
    content: node.content,
    file,
    line,
    tag: '',
    type: node.type
  })
  pretendToUse(openTags)
  return result
}
