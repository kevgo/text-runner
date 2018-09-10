import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import AstNodeList from "../../../ast-node-list.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openNode = openTags.popType(
    "blockquote_open",
    file.platformified(),
    line
  )
  result.pushNode({
    type: node.type,
    tag: "/blockquote",
    file,
    line,
    content: "",
    attributes: openNode.attributes
  })
  return result
}
