import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"
import AstNodeList from "../../../ast-node-list.js"
import AstNode from "../../../ast-node.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import parseHtmlAttributes from "../../helpers/parse-html-attributes.js"
import removeHtmlComments from "../../helpers/remove-html-comments.js"

const olRegex = /<img([^>]*)>/

module.exports = async function transformOl(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = removeHtmlComments(node.content).match(olRegex)
  if (!match) {
    throw new Error("cannot parse tag")
  }
  const hrNode = new AstNode({
    attributes: parseHtmlAttributes(match[1]),
    content: "",
    file,
    line,
    tag: "img",
    type: "image"
  })
  result.pushNode(hrNode)
  pretendToUse(openTags)
  return result
}
