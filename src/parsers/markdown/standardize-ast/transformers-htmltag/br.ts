import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import AstNode from "../../../ast-node.js"
import AstNodeList from "../../../ast-node-list.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import parseHtmlTag from "../../helpers/parse-html-tag.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"

module.exports = function transformATag(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const [tag, attributes] = parseHtmlTag(
    node.content,
    file.platformified(),
    line
  )
  const resultNode = new AstNode({
    type: "linebreak",
    tag,
    file,
    line,
    content: "",
    attributes
  })
  result.pushNode(resultNode)
  pretendToUse(openTags)
  return result
}
