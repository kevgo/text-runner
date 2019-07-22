import { UnprintedUserError } from "../../../../../errors/unprinted-user-error"
import { AbsoluteFilePath } from "../../../../../finding-files/absolute-file-path"
import { AstNode } from "../../../../ast-node"
import { AstNodeList } from "../../../../ast-node-list"
import { OpenTagTracker } from "../../../helpers/open-tag-tracker"
import { parseHtmlAttributes } from "../../../helpers/parse-html-attributes"
import { RemarkableNode } from "../../remarkable-node"

const blockquoteRegex = /<blockquote([^>]*)>([\s\S]*)<\/blockquote>/m

export default async function transformBlockquote(
  node: RemarkableNode,
  // @ts-ignore: unused variable
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const blockquoteMatch = node.content.match(blockquoteRegex)
  if (blockquoteMatch == null) {
    throw new UnprintedUserError(
      "Cannot parse blockquote expression",
      file.platformified(),
      line
    )
  }
  const resultNode = new AstNode({
    attributes: parseHtmlAttributes(blockquoteMatch[1]),
    content: blockquoteMatch[2],
    file,
    line,
    tag: "blockquote",
    type: "blockquote"
  })
  result.pushNode(resultNode)
  return result
}
