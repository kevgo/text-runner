import AbsoluteFilePath from "../../../../domain-model/absolute-file-path"
import AstNodeList from "../../../ast-node-list"
import OpenTagTracker from "../../helpers/open-tag-tracker"

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const openNode = openTags.popType("paragraph_open")
  const result = new AstNodeList()
  result.pushNode({
    type: node.type,
    tag: "/p",
    file,
    line,
    content: "",
    attributes: openNode.attributes
  })
  return result
}
