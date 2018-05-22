// @flow

import type { Activity } from '../../src/activity-list/activity.js'

const AstNodeList = require('../../src/parsers/ast-node-list.js')

module.exports = function scaffoldActivity (data: {
  type?: string,
  nodes?: AstNodeList,
  file?: string,
  line?: number
}): Activity {
  return {
    type: data.type || 'foo',
    nodes: data.nodes || new AstNodeList(),
    file: data.file || 'file',
    line: data.line || 0
  }
}
