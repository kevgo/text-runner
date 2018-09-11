import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"
import AstNodeList from "../../../ast-node-list.js"
import AstNode from "../../../ast-node.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import parseHtmlAttributes from "../../helpers/parse-html-attributes.js"

const olRegex = /<hr([^>]*)>/

module.exports = async function transformOl(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(olRegex)
  const hrNode = new AstNode({
    attributes: parseHtmlAttributes(match[1]),
    content: "",
    file,
    line,
    tag: "hr",
    type: "horizontal_row"
  })
  result.pushNode(hrNode)
  pretendToUse(openTags)
  return result
}
