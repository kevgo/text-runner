import { Activity } from "../../src/activity-list/activity"
import AbsoluteFilePath from "../../src/domain-model/absolute-file-path"
import AstNodeList from "../../src/parsers/ast-node-list"

export default function scaffoldActivity(data: {
  type?: string
  nodes?: AstNodeList
  file?: string
  line?: number
}): Activity {
  return {
    file: new AbsoluteFilePath(data.file || "file"),
    line: data.line || 0,
    nodes: data.nodes || new AstNodeList(),
    type: data.type || "foo"
  }
}
