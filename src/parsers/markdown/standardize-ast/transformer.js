// @flow

const AbsoluteFilePath = require('../../../domain-model/absolute-file-path.js')
const AstNodeList = require('../../ast-node-list.js')
const OpenTagTracker = require('../helpers/open-tag-tracker.js')

export type Transformer = (
  Object,
  OpenTagTracker,
  AbsoluteFilePath,
  number
) => AstNodeList
