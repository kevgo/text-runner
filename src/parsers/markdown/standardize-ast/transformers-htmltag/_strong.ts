import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"
import AstNodeList from "../../../ast-node-list.js"
import AstNode from "../../../ast-node.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"

module.exports = function transformATag(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openingTag = openTags.popType("strong_open")
  const resultNode = new AstNode({
    type: "strong_close",
    tag: "/strong",
    file,
    line,
    content: "",
    attributes: openingTag.attributes
  })
  result.pushNode(resultNode)
  pretendToUse(node)
  return result
}
