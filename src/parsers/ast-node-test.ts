import { expect } from 'chai'
import AstNode from './ast-node'

describe('AstNode', function() {
  describe('scaffold', function() {
    it('returns a new node with the given attributes', function() {
      const node = AstNode.scaffold({ type: 'heading_open' })
      expect(node.type).to.eql('heading_open')
    })
  })

  describe('endTypeFor', function() {
    it('returns the closing tag', function() {
      const data = {
        anchor_open: 'anchor_close',
        heading_open: 'heading_close'
      }
      for (const input in data) {
        if (!data.hasOwnProperty(input)) {
          continue
        }
        const node = AstNode.scaffold({ type: input })
        expect(node.endType()).to.eql(data[input])
      }
    })
  })

  describe('htmlLinkTarget', function() {
    it('returns the href content of link tags', function() {
      const node = AstNode.scaffold({
        content: '<a href="http://foo.com">',
        type: 'htmltag'
      })
      expect(node.htmlLinkTarget()).to.equal('http://foo.com')
    })
    it('returns null for non-link tags', function() {
      const node = AstNode.scaffold({ type: 'htmltag', content: 'hello' })
      expect(node.htmlLinkTarget()).to.be.null
    })
    it('returns null for anchor tags', function() {
      const node = AstNode.scaffold({
        content: '<a name="foo">',
        type: 'htmltag'
      })
      expect(node.htmlLinkTarget()).to.be.null
    })
  })
})
