// @flow

const AstNodeList = require('../parsers/ast-node-list.js')
const { expect } = require('chai')
const extractImagesAndLinks = require('./extract-images-and-links.js')

describe('extractImagesAndLinks', function () {
  it('extracts images', function () {
    const nodes = new AstNodeList()
    nodes.scaffold({ type: 'image', file: 'filename', line: 3 })
    const result = extractImagesAndLinks([nodes])
    expect(result).to.have.length(1)
    expect(result[0].type).to.equal('check-image')
    expect(result[0].file).to.equal('filename')
    expect(result[0].line).to.equal(3)
    expect(result[0].nodes).to.have.length(1)
    expect(result[0].nodes[0]).to.equal(nodes[0])
  })

  it('extracts links', function () {
    const nodes = new AstNodeList()
    nodes.scaffold({ type: 'link_open', file: 'filename', line: 3 })
    nodes.scaffold({ type: 'text', file: 'filename', line: 3, content: 'foo' })
    nodes.scaffold({ type: 'link_close', file: 'filename', line: 3 })
    const result = extractImagesAndLinks([nodes])
    expect(result).to.have.length(1)
    expect(result[0].type).to.equal('check-link')
    expect(result[0].file).to.equal('filename')
    expect(result[0].line).to.equal(3)
    expect(result[0].nodes).to.eql(nodes)
  })
})
