import { expect } from 'chai'
import AstNodeList from '../parsers/ast-node-list'
import extractActivities from './extract-activities'

describe('extract-activities', function() {
  it('extracts activities', function() {
    const AST = new AstNodeList()
    AST.pushNode({
      attributes: { textrun: 'verify-foo' },
      file: 'README.md',
      line: 3,
      type: 'anchor_open'
    })
    AST.pushNode({ type: 'text' })
    AST.pushNode({ type: 'anchor_close' })
    const result = extractActivities([AST], 'textrun')
    expect(result).to.have.length(1)
    expect(result[0].type).to.equal('verify-foo')
    expect(result[0].file.unixified()).to.equal('README.md')
    expect(result[0].line).to.equal(3)
    expect(result[0].nodes).to.eql(AST)
  })

  it('normalizes activity names in CamelCase', function() {
    const AST = new AstNodeList()
    AST.pushNode({
      attributes: { textrun: 'verifyFoo' },
      file: 'README.md',
      line: 3,
      type: 'anchor_open'
    })
    AST.pushNode({ type: 'anchor_close' })
    const result = extractActivities([AST], 'textrun')
    expect(result[0].type).to.equal('verify-foo')
  })

  it('normalizes activity names in kebab-case', function() {
    const AST = new AstNodeList()
    AST.pushNode({
      attributes: { textrun: 'verify-foo' },
      file: 'README.md',
      line: 3,
      type: 'anchor_open'
    })
    AST.pushNode({ type: 'anchor_close' })
    const result = extractActivities([AST], 'textrun')
    expect(result[0].type).to.equal('verify-foo')
  })

  it('normalizes activity names in snake_case', function() {
    const AST = new AstNodeList()
    AST.pushNode({
      attributes: { textrun: 'verify_foo' },
      file: 'README.md',
      line: 3,
      type: 'anchor_open'
    })
    AST.pushNode({ type: 'anchor_close' })
    const result = extractActivities([AST], 'textrun')
    expect(result[0].type).to.equal('verify-foo')
  })
})
