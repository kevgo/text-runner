// @flow

import type { AstNode } from '../../../ast-node.js'

const OpenTagTracker = require('../helpers/open-tag-tracker.js')

export type Transformer = (Object, OpenTagTracker, string, number) => ?AstNode
