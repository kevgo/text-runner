import AbsoluteFilePath from "../../../domain-model/absolute-file-path.js"
import AstNodeList from "../../ast-node-list.js"
import OpenTagTracker from "../helpers/open-tag-tracker.js"

export type Transformer = (
  obj: any,
  ott: OpenTagTracker,
  afp: AbsoluteFilePath,
  n: number
) => AstNodeList
