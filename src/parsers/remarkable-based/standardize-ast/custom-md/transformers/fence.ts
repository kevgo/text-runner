import { AbsoluteFilePath } from "../../../../../filesystem/absolute-file-path"
import { AstNodeList } from "../../../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../../../helpers/open-tag-tracker"
import { RemarkableNode } from "../../types/remarkable-node"

export default function(
  node: RemarkableNode,
  // @ts-ignore: unused variable
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
  return result
}
