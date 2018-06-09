// @flow

const AstNodeList = require('../../ast-node-list.js')
const OpenTagTracker = require('../helpers/open-tag-tracker.js')

export type Transformer = (
  Object,
  OpenTagTracker,
  string,
  number
) => AstNodeList
