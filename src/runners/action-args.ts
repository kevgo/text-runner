import { Configuration } from '../configuration/configuration'
import Formatter from '../formatters/formatter'
import LinkTargetList from '../link-targets/link-target-list'
import AstNodeList from '../parsers/ast-node-list'

export interface ActionArgs {
  nodes: AstNodeList
  file: string
  line: number
  formatter: Formatter
  configuration: Configuration
  linkTargets: LinkTargetList
}
