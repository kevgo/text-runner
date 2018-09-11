import AstNode from "../../../ast-node.js"
import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import AstNodeList from "../../../ast-node-list.js"
import parseHtmlAttributes from "../../helpers/parse-html-attributes.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import removeHtmlComments from "../../helpers/remove-html-comments.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"

const olRegex = /<img([^>]*)>/

module.exports = async function transformOl(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = removeHtmlComments(node.content).match(olRegex)
  if (!match) throw new Error("cannot parse tag")
  const hrNode = new AstNode({
    type: "image",
    tag: "img",
    file,
    line,
    content: "",
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushNode(hrNode)
  pretendToUse(openTags)
  return result
}
