const AstNode = require('./ast-node.js')

describe('AstNode', function () {
  describe('scaffold', function () {
    it('returns a new node with the given attributes', function () {
      const node = AstNode.scaffold({ type: 'heading_open' })
      expect(node.type).to.eql('heading_open')
    })
  })
  describe('endTypeFor', function () {
    it('returns the closing tag', function () {
      const data = {
        heading_open: 'heading_close',
        anchor_open: 'anchor_close'
      }
      for (const input in data) {
        const node = new AstNode({ type: input })
        expect(node.endType()).to.eql(data[input])
      }
    })
  })
})
