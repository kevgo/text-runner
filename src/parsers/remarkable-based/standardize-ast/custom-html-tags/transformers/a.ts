import { AbsoluteFilePath } from "../../../../../filesystem/absolute-file-path"
import { AstNode } from "../../../../standard-AST/ast-node"
import { AstNodeList } from "../../../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../../../helpers/open-tag-tracker"
import { parseHtmlTag } from "../../../helpers/parse-html-tag"
import { RemarkableNode } from "../../types/remarkable-node"

export default function transformATag(
  node: RemarkableNode,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const [tag, attributes] = parseHtmlTag(
    node.content,
    file.platformified(),
    line
  )
  const resultNode = new AstNode({
    attributes,
    content: "",
    file,
    line,
    tag,
    type: attributes.href != null ? "link_open" : "anchor_open"
  })
  openTags.add(resultNode)
  result.pushNode(resultNode)
  return result
}
