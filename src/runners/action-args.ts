import { Configuration } from '../configuration/configuration.js'

import AstNodeList from '../parsers/ast-node-list.js'
import Formatter from '../formatters/formatter.js'
import LinkTargetList from '../link-targets/link-target-list.js'

export type ActionArgs = {
  nodes: AstNodeList,
  file: string,
  line: number,
  formatter: Formatter,
  configuration: Configuration,
  linkTargets: LinkTargetList
}
