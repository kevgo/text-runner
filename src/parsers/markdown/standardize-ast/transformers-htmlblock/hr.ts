import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import AstNode from "../../../ast-node.js"
import AstNodeList from "../../../ast-node-list.js"
import parseHtmlAttributes from "../../helpers/parse-html-attributes.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"

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
    type: "horizontal_row",
    tag: "hr",
    file,
    line,
    content: "",
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushNode(hrNode)
  pretendToUse(openTags)
  return result
}
