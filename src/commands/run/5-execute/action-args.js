// @flow

const AstNodeList = require('../../../parsers/ast-node-list.js')
const Configuration = require('../../../configuration/configuration.js')
const Formatter = require('../../../formatters/formatter.js')
const LinkTargetList = require('../3-link-targets/link-target-list.js')

export type ActionArgs = {
  nodes: AstNodeList,
  file: string,
  line: number,
  formatter: Formatter,
  configuration: Configuration,
  linkTargets: LinkTargetList
}
