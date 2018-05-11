// @flow
/* eslint no-unused-expressions: 0 */

const AstNode = require('../../ast-node.js')
const OpenTagTracker = require('./open-tag-tracker.js')
const { expect } = require('chai')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

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

  describe('peek', function () {
    it('returns the latest open tag', function () {
      const node1 = AstNode.scaffold({ type: 'foo', line: 3 })
      this.openTags.add(node1)
      const node2 = AstNode.scaffold({ type: 'bar', line: 3 })
      this.openTags.add(node2)
      const result = this.openTags.peek()
      expect(result).to.equal(node2)
    })
  })

  describe('pop', function () {
    it('returns the given open tag', function () {
      const node = AstNode.scaffold({ type: 'foo', line: 3 })
      this.openTags.add(node)
      const result = this.openTags.pop('foo')
      expect(result).to.equal(node)
    })
    it('throws if the tag is not the expected type', function () {
      const node = AstNode.scaffold({ type: 'foo', line: 3 })
      this.openTags.add(node)
      expect(() => this.openTags.pop('other')).to.throw(UnprintedUserError)
    })
  })
})
