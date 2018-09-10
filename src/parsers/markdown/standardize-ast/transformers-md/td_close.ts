import AbsoluteFilePath from "../../../../domain-model/absolute-file-path"
import AstNodeList from "../../../ast-node-list"
import OpenTagTracker from "../../helpers/open-tag-tracker"

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  result.pushNode({
    type: node.type,
    tag: "/td",
    file,
    line,
    content: "",
    attributes: {}
  })
  openTags.popType("td_open", file.platformified(), line)
  return result
}
