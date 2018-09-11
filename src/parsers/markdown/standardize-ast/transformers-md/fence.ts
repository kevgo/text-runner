import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"
import AstNodeList from "../../../ast-node-list.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  result.pushNode({
    attributes: {},
    content: "",
    file,
    line,
    tag: "p",
    type: "paragraph_open"
  })
  result.pushNode({
    attributes: {},
    content: "",
    file,
    line,
    tag: "pre",
    type: "fence_open"
  })
  result.pushNode({
    attributes: {},
    content: node.content,
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
  result.pushNode({
    attributes: {},
    content: "",
    file,
    line,
    tag: "/p",
    type: "paragraph_close"
  })
  pretendToUse(openTags)
  return result
}
