import AstNodeList from '../../../ast-node-list.js'
import OpenTagTracker from '../../helpers/open-tag-tracker.js'

export default function(
  node: any,
  openTags: OpenTagTracker,
  filepath: string,
  line: number
): AstNodeList {
  return new AstNodeList()
}
