import AbsoluteFilePath from "../../../../domain-model/absolute-file-path"
import pretendToUse from "../../../../helpers/pretend-to-use"
import AstNodeList from "../../../ast-node-list"
import AstNode from "../../../ast-node"
import OpenTagTracker from "../../helpers/open-tag-tracker"

module.exports = function transformATag(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openingTag = openTags.popType("strong_open")
  const resultNode = new AstNode({
    attributes: openingTag.attributes,
    content: "",
    file,
    line,
    tag: "/strong",
    type: "strong_close"
  })
  result.pushNode(resultNode)
  pretendToUse(node)
  return result
}
