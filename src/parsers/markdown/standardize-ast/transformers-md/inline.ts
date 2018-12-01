import pretendToUse from '../../../../helpers/pretend-to-use'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'

export default function(
  node: any,
  openTags: OpenTagTracker,
  filepath: string,
  line: number
): AstNodeList {
  pretendToUse(node, openTags, filepath, line)
  return new AstNodeList()
}
