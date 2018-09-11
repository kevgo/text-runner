import AbsoluteFilePath from "../../../../domain-model/absolute-file-path"
import AstNode from "../../../ast-node"
import AstNodeList from "../../../ast-node-list"
import parseHtmlAttributes from "../../helpers/parse-html-attributes"
import OpenTagTracker from "../../helpers/open-tag-tracker"
import pretendToUse from "../../../../helpers/pretend-to-use"

const blockquoteRegex = /<blockquote([^>]*)>([\s\S]*)<\/blockquote>/m

module.exports = async function transformBlockquote(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const blockquoteMatch = node.content.match(blockquoteRegex)
  const resultNode = new AstNode({
    type: "blockquote",
    tag: "blockquote",
    file,
    line,
    content: blockquoteMatch[2],
    attributes: parseHtmlAttributes(blockquoteMatch[1])
  })
  result.pushNode(resultNode)
  pretendToUse(openTags)
  return result
}
