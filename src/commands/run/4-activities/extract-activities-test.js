// @flow

import type { ActivityList } from '../4-activities/activity-list.js'

const AstNodeList = require('../../../parsers/ast-node-list.js')
const extractActivities = require('./extract-activities.js')
const { expect } = require('chai')

describe('extract-activities', function () {
  it('extracts active A tags', function () {
    const AST = new AstNodeList()
    AST.scaffold({
      type: 'htmltag',
      filepath: 'README.md',
      line: 3,
      content: '<a textrun="verify-foo">'
    })
    AST.scaffold({
      type: 'htmltag',
      filepath: 'README.md',
      line: 4,
      content: '</a>'
    })
    const result: ActivityList = extractActivities([AST], 'textrun')
    expect(result).to.eql([
      {
        filename: 'README.md',
        line: 4,
        nodes: [],
        type: 'verify-foo'
      }
    ])
  })

  it('extracts active CODE tags', function () {})
})
