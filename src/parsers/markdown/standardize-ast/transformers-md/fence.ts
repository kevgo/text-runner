import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import AstNodeList from "../../../ast-node-list.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  result.pushNode({
    type: "paragraph_open",
    tag: "p",
    file: file,
    line,
    content: "",
    attributes: {}
  })
  result.pushNode({
    type: "fence_open",
    tag: "pre",
    file: file,
    line,
    content: "",
    attributes: {}
  })
  result.pushNode({
    type: "text",
    tag: "",
    file: file,
    line,
    content: node.content,
    attributes: {}
  })
  result.pushNode({
    type: "fence_close",
    tag: "/pre",
    file: file,
    line,
    content: "",
    attributes: {}
  })
  result.pushNode({
    type: "paragraph_close",
    tag: "/p",
    file: file,
    line,
    content: "",
    attributes: {}
  })
  pretendToUse(openTags)
  return result
}
