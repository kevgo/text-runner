// @flow

import type { Configuration } from '../configuration/configuration.js'

const AstNodeList = require('../parsers/ast-node-list.js')
const Formatter = require('../formatters/formatter.js')
const LinkTargetList = require('../link-targets/link-target-list.js')

export type ActionArgs = {
  nodes: AstNodeList,
  file: string,
  line: number,
  formatter: Formatter,
  configuration: Configuration,
  linkTargets: LinkTargetList
}
