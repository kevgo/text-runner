import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import AstNodeList from "../../../ast-node-list.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"

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
