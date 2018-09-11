import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import UnprintedUserError from "../../../../errors/unprinted-user-error.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"
import AstNodeList from "../../../ast-node-list.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import parseHtmlAttributes from "../../helpers/parse-html-attributes.js"

const preRegex = /<pre([^>]*)>([\s\S]*)<\/pre>/m
const tableRegex = /<table([^>]*)>[\s\S]*<\/table>/

export default function(
  node: any,
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
    pretendToUse(openTags)
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
