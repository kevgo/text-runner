import { AbsoluteFilePath } from "../../../../../domain-model/absolute-file-path"
import { AstNode } from "../../../../ast-node"
import { AstNodeList } from "../../../../ast-node-list"
import { OpenTagTracker } from "../../../helpers/open-tag-tracker"
import { RemarkableNode } from "../../remarkable-node"

export default function transformATag(
  // @ts-ignore: unused variable
  node: RemarkableNode,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openingTag = openTags.popTag("a", file, line)
  const resultNode = new AstNode({
    attributes: openingTag.attributes,
    content: "",
    file,
    line,
    tag: "/a",
    type: openingTag.type.replace("_open", "_close")
  })
  result.pushNode(resultNode)
  return result
}
