// @flow

const AstNode = require('../../ast-node.js')
const OpenTagTracker = require('./open-tag-tracker.js')
const { expect } = require('chai')

describe('OpenTagTracker', function () {
  beforeEach(function () {
    this.openTags = new OpenTagTracker()
  })

  describe('add', function () {
    it('adds new tag types', function () {
      this.openTags.add(AstNode.scaffold())
    })

    it('does not allow to add existing tag types', function () {
      const add = () => {
        this.openTags.add(AstNode.scaffold({ type: 'foo' }))
      }
      expect(add).to.throw
    })
  })

  describe('pop', function () {
    it('returns the given open tag', function () {
      const node = AstNode.scaffold({ type: 'foo', line: 3 })
      this.openTags.add(node)
      const result = this.openTags.pop('foo')
      expect(result).to.equal(node)
    })
  })
})
