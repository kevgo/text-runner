import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import UnprintedUserError from "../../../../errors/unprinted-user-error.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"
import AstNodeList from "../../../ast-node-list.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"

const parseHtmlAttributes = require("../../helpers/parse-html-attributes.js")
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
      type: "fence_open",
      tag: "pre",
      file,
      line,
      content: "",
      attributes: parseHtmlAttributes(preMatch[1])
    })
    result.pushNode({
      type: "text",
      tag: "",
      file,
      line,
      content: preMatch[2],
      attributes: {}
    })
    result.pushNode({
      type: "fence_close",
      tag: "/pre",
      file,
      line,
      content: "",
      attributes: {}
    })
    pretendToUse(openTags)
    return result
  }
  const tableMatch = node.content.trim().match(tableRegex)
  if (tableMatch) {
    result.pushNode({
      type: "table",
      tag: "table",
      file,
      line,
      content: node.content.trim(),
      attributes: parseHtmlAttributes(tableMatch[1])
    })
    return result
  }
  throw new UnprintedUserError(
    `Unknown 'htmlblock' encountered: ${node.content}`,
    file.platformified(),
    line
  )
}
