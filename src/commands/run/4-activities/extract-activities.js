// @flow

import type { ActivityList } from './activity-list.js'
import type { AstNodeList } from '../2-read-and-parse/ast-node-list.js'

const ActivityListBuilder = require('./activity-list-builder.js')
const ActivityTypeManager = require('./activity-type-manager.js')
const Configuration = require('../../../configuration/configuration.js')
const Formatter = require('../../../formatters/formatter.js')

module.exports = function (
  ASTs: AstNodeList[],
  config: Configuration,
  format: Formatter
) {
  const activityTypesManager = new ActivityTypeManager(format, config)
  return ASTs.map(ast =>
    extractActivity(ast, config, format, activityTypesManager)
  )
}

// Finds all activities in the given AST
function extractActivity (
  AST: AstNodeList,
  config: Configuration,
  format: Formatter,
  activityTypesManager: ActivityTypeManager
): ActivityList {
  const activityListBuilder = new ActivityListBuilder(config, format)
  return activityListBuilder.build(AST)
}
