import { UnprintedUserError } from "../../../../../errors/unprinted-user-error"
import { AbsoluteFilePath } from "../../../../../filesystem/absolute-file-path"
import { AstNode } from "../../../../standard-AST/ast-node"
import { AstNodeList } from "../../../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../../../helpers/open-tag-tracker"
import { parseHtmlAttributes } from "../../../helpers/parse-html-attributes"
import { RemarkableNode } from "../../types/remarkable-node"

const preRegex = /<pre([^>]*)>([\s\S]*)<\/pre>/m

export default async function transformPre(
  node: RemarkableNode,
  // @ts-ignore: unused variable
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(preRegex)
  if (!match) {
    throw new UnprintedUserError(
      "cannot match <pre> tag",
      file.platformified(),
      line
    )
  }
  const resultNode = new AstNode({
    attributes: parseHtmlAttributes(match[1]),
    content: match[2],
    file,
    line,
    tag: "pre",
    type: "fence"
  })
  result.pushNode(resultNode)
  return result
}
