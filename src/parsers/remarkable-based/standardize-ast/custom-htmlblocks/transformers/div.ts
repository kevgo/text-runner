import { UnprintedUserError } from "../../../../../errors/unprinted-user-error"
import { AbsoluteFilePath } from "../../../../../filesystem/absolute-file-path"
import { AstNode } from "../../../../standard-AST/ast-node"
import { AstNodeList } from "../../../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../../../helpers/open-tag-tracker"
import { parseHtmlAttributes } from "../../../helpers/parse-html-attributes"
import { RemarkableNode } from "../../types/remarkable-node"

const divRegex = /<div([^>]*)>([\s\S]*)<\/div>/m

export default async function transformDiv(
  node: RemarkableNode,
  // @ts-ignore: unused variable
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const divMatch = node.content.match(divRegex)
  if (divMatch == null) {
    throw new UnprintedUserError(
      "Cannot parse div expression",
      file.platformified(),
      line
    )
  }
  const resultNode = new AstNode({
    attributes: parseHtmlAttributes(divMatch[1]),
    content: divMatch[2],
    file,
    line,
    tag: "div",
    type: "div"
  })
  result.pushNode(resultNode)
  return result
}
