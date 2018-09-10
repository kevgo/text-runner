import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import AstNodeList from "../../../ast-node-list.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const openNode = openTags.popType("heading_open", file.platformified(), line)
  const result = new AstNodeList()
  result.pushNode({
    type: node.type,
    tag: `/${openNode.tag}`,
    file,
    line,
    content: "",
    attributes: openNode.attributes
  })
  return result
}
