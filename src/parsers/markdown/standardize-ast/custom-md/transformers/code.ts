import { AbsoluteFilePath } from "../../../../../finding-files/absolute-file-path"
import { AstNodeList } from "../../../../ast-node-list"
import { OpenTagTracker } from "../../../helpers/open-tag-tracker"
import { RemarkableNode } from "../../remarkable-node"

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
    tag: "code",
    type: "code_open"
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
    tag: "/code",
    type: "code_close"
  })
  return result
}
