import { UnprintedUserError } from "../../../../../errors/unprinted-user-error"
import { AbsoluteFilePath } from "../../../../../finding-files/absolute-file-path"
import { AstNode } from "../../../../standard-AST/ast-node"
import { AstNodeList } from "../../../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../../../helpers/open-tag-tracker"
import { parseHtmlAttributes } from "../../../helpers/parse-html-attributes"
import { RemarkableNode } from "../../types/remarkable-node"

const olRegex = /<hr([^>]*)>/

export default async function transformOl(
  node: RemarkableNode,
  // @ts-ignore: unused variable
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(olRegex)
  if (match == null) {
    throw new UnprintedUserError(
      "Cannot parse ol expression",
      file.platformified(),
      line
    )
  }
  const hrNode = new AstNode({
    attributes: parseHtmlAttributes(match[1]),
    content: "",
    file,
    line,
    tag: "hr",
    type: "horizontal_row"
  })
  result.pushNode(hrNode)
  return result
}
