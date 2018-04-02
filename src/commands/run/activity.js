// @flow

import type { HandlerFunction } from './handler-function.js'
import type { AstNodeList } from '../../parsers/ast-node-list.js'
import type Configuration from '../../configuration/configuration.js'
import type Formatter from '../../formatters/formatter.js'
import type { LinkTargetList } from './link-target-list.js'
import type Searcher from './searcher.js'

// Activity is an action instance, i.e. a particular activity that we are going to do
// on a particular place in a particular document, defined by an action
export type Activity = {
  filename: string,
  activityTypeName: string,
  line: ?number,
  formatter: Formatter,
  runner: HandlerFunction,
  nodes: AstNodeList,
  linkTargets: LinkTargetList,
  configuration: Configuration,
  searcher: Searcher
}
