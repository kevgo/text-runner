import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import pretendToUse from '../../../../helpers/pretend-to-use'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  pretendToUse(node, openTags, file, line)
  return result
}
