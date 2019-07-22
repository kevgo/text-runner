import { AbsoluteFilePath } from "../../../../../filesystem/absolute-file-path"
import { AstNode } from "../../../../standard-AST/ast-node"
import { AstNodeList } from "../../../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../../../helpers/open-tag-tracker"
import { parseHtmlAttributes } from "../../../helpers/parse-html-attributes"
import { removeHtmlComments } from "../../../helpers/remove-html-comments"
import { RemarkableNode } from "../../types/remarkable-node"

const olRegex = /<img([^>]*)>/

export default async function transformOl(
  node: RemarkableNode,
  // @ts-ignore: unused variable
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
  return result
}
