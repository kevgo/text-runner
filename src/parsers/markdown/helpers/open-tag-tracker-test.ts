import { expect } from 'chai'
import AstNode from '../../ast-node'
import OpenTagTracker from './open-tag-tracker'

describe('OpenTagTracker', function() {
  beforeEach(function() {
    this.openTags = new OpenTagTracker()
  })

  describe('add', function() {
    it('adds new tag types', function() {
      this.openTags.add(AstNode.scaffold())
    })

    it('does not allow to add existing tag types', function() {
      const add = () => {
        this.openTags.add(AstNode.scaffold({ type: 'foo' }))
      }
      expect(add).to.throw
    })
  })

  describe('peek', function() {
    it('returns the latest open tag', function() {
      const node1 = AstNode.scaffold({ type: 'foo', line: 3 })
      this.openTags.add(node1)
      const node2 = AstNode.scaffold({ type: 'bar', line: 3 })
      this.openTags.add(node2)
      const result = this.openTags.peek()
      expect(result).to.equal(node2)
    })
  })

  describe('popType', function() {
    it('returns the given open tag from the end', function() {
      const node = AstNode.scaffold({ type: 'foo', line: 3 })
      this.openTags.add(node)
      const result = this.openTags.popType('foo')
      expect(result).to.equal(node)
    })
    it('returns the given open tag from close to the end', function() {
      const node1 = AstNode.scaffold({ type: 'foo', line: 3 })
      this.openTags.add(node1)
      const node2 = AstNode.scaffold({ type: 'bar', line: 3 })
      this.openTags.add(node2)
      const result = this.openTags.popType('foo')
      expect(result).to.equal(node1)
      expect(this.openTags.nodes).to.have.length(1)
      const types = this.openTags.nodes.map(node => node.type)
      expect(types).to.eql(['bar'])
    })
    it('throws if the tag is not the expected type', function() {
      const node = AstNode.scaffold({ type: 'foo', line: 3 })
      this.openTags.add(node)
      expect(() => this.openTags.popType('other')).to.throw(Error)
    })
  })
})
