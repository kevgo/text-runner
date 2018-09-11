import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import UnprintedUserError from "../../../../errors/unprinted-user-error.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"
import AstNodeList from "../../../ast-node-list.js"
import AstNode from "../../../ast-node.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import parseHtmlAttributes from "../../helpers/parse-html-attributes.js"

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
    attributes: parseHtmlAttributes(match[1]),
    content: match[2],
    file,
    line,
    tag: "p",
    type: "paragraph"
  })
  result.pushNode(resultNode)
  pretendToUse(openTags)
  return result
}
