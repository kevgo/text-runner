import AstNodeList from "../../../ast-node-list.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"

export default function(
  node: any,
  openTags: OpenTagTracker,
  filepath: string,
  line: number
): AstNodeList {
  pretendToUse(node, openTags, filepath, line)
  return new AstNodeList()
}
