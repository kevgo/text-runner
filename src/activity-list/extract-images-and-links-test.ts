import { expect } from 'chai'
import AstNodeList from '../parsers/ast-node-list'
import extractImagesAndLinks from './extract-images-and-links'

describe('extractImagesAndLinks', function() {
  it('extracts images', function() {
    const nodes = AstNodeList.scaffold({
      file: 'filename',
      line: 3,
      type: 'image'
    })
    const result = extractImagesAndLinks([nodes])
    expect(result).to.have.length(1)
    expect(result[0].type).to.equal('check-image')
    expect(result[0].file.unixified()).to.equal('filename')
    expect(result[0].line).to.equal(3)
    expect(result[0].nodes).to.have.length(1)
    expect(result[0].nodes[0]).to.equal(nodes[0])
  })

  it('extracts links', function() {
    const nodes = new AstNodeList()
    nodes.pushNode({ type: 'link_open', file: 'filename', line: 3 })
    nodes.pushNode({ type: 'text', file: 'filename', line: 3, content: 'foo' })
    nodes.pushNode({ type: 'link_close', file: 'filename', line: 3 })
    const result = extractImagesAndLinks([nodes])
    expect(result).to.have.length(1)
    expect(result[0].type).to.equal('check-link')
    expect(result[0].file.unixified()).to.equal('filename')
    expect(result[0].line).to.equal(3)
    expect(result[0].nodes).to.eql(nodes)
  })
})
