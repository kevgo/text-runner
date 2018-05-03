// @flow

const AstNodeList = require('../../../parsers/ast-node-list.js')
const extractActivities = require('./extract-activities.js')
const { expect } = require('chai')

describe('extract-activities', function () {
  it('extracts activities', function () {
    const AST = new AstNodeList()
    AST.scaffold({
      type: 'anchor_open',
      file: 'README.md',
      line: 3,
      attributes: { textrun: 'verify-foo' }
    })
    AST.scaffold({ type: 'text' })
    AST.scaffold({ type: 'anchor_close' })
    const result = extractActivities([AST], 'textrun')
    expect(result).to.have.length(1)
    expect(result[0].type).to.equal('verify-foo')
    expect(result[0].file).to.equal('README.md')
    expect(result[0].line).to.equal(3)
    expect(result[0].nodes).to.eql(AST)
  })
})
