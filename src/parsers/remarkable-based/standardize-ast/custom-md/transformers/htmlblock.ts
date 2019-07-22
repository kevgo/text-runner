import { UnprintedUserError } from "../../../../../errors/unprinted-user-error"
import { AbsoluteFilePath } from "../../../../../filesystem/absolute-file-path"
import { AstNodeList } from "../../../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../../../helpers/open-tag-tracker"
import { parseHtmlAttributes } from "../../../helpers/parse-html-attributes"
import { RemarkableNode } from "../../types/remarkable-node"

const preRegex = /<pre([^>]*)>([\s\S]*)<\/pre>/m
const tableRegex = /<table([^>]*)>[\s\S]*<\/table>/

export default function(
  node: RemarkableNode,
  // @ts-ignore: unused variable
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const preMatch = node.content.match(preRegex)
  if (preMatch) {
    result.pushNode({
      attributes: parseHtmlAttributes(preMatch[1]),
      content: "",
      file,
      line,
      tag: "pre",
      type: "fence_open"
    })
    result.pushNode({
      attributes: {},
      content: preMatch[2],
      file,
      line,
      tag: "",
      type: "text"
    })
    result.pushNode({
      attributes: {},
      content: "",
      file,
      line,
      tag: "/pre",
      type: "fence_close"
    })
    return result
  }
  const tableMatch = node.content.trim().match(tableRegex)
  if (tableMatch) {
    result.pushNode({
      attributes: parseHtmlAttributes(tableMatch[1]),
      content: node.content.trim(),
      file,
      line,
      tag: "table",
      type: "table"
    })
    return result
  }
  throw new UnprintedUserError(
    `Unknown 'htmlblock' encountered: ${node.content}`,
    file.platformified(),
    line
  )
}
