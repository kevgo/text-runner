import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import AstNode from "../../../ast-node.js"
import AstNodeList from "../../../ast-node-list.js"
import parseHtmlAttributes from "../../helpers/parse-html-attributes.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import UnprintedUserError from "../../../../errors/unprinted-user-error.js"

const pRegex = /<p([^>]*)>([\s\S]*)<\/p>/m

module.exports = async function transformPBlock(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(pRegex)
  if (!match) {
    throw new UnprintedUserError(
      "cannot match <p> tag",
      file.platformified(),
      line
    )
  }
  const resultNode = new AstNode({
    type: "paragraph",
    tag: "p",
    file,
    line,
    content: match[2],
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushNode(resultNode)
  return result
}
