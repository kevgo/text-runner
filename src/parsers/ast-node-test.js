const AstNode = require('./ast-node.js')

describe('AstNode', function () {
  describe('scaffold', function () {
    it('returns a new node with the given attributes', function () {
      const node = AstNode.scaffold({ type: 'heading_open' })
      expect(node.type).to.eql('heading_open')
    })
  })
})
