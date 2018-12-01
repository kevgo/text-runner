import AbsoluteFilePath from '../../../domain-model/absolute-file-path'
import AstNodeList from '../../ast-node-list'
import OpenTagTracker from '../helpers/open-tag-tracker'

export type Transformer = (
  obj: any,
  ott: OpenTagTracker,
  afp: AbsoluteFilePath,
  n: number
) => AstNodeList
