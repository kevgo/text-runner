// @flow

const createAstNode = require('../../../../../../../test/create-ast-node.js')
const OpenTagTracker = require('./open-tag-tracker.js')
const { expect } = require('chai')

describe('OpenTagTracker', function () {
  beforeEach(function () {
    this.openTags = new OpenTagTracker()
  })

  describe('add', function () {
    it('adds new tag types', function () {
      const node = createAstNode({})
      this.openTags.add(node)
    })

    it('does not allow to add existing tag types', function () {
      const node = createAstNode({ type: 'foo' })
      const add = () => {
        this.openTags.add(node)
      }
      add()
      expect(add).to.throw
    })
  })

  describe('tagDataFor', function () {
    it('returns the given open tag', function () {
      const node = createAstNode({ type: 'foo' })
      this.openTags.add(node, 'file.md', 3)
      const result = this.openTags.popOpenTagFor('foo')
      expect(result).to.eql({
        node,
        line: 3,
        text: ''
      })
    })
  })

  describe('addText', function () {
    it('adds the given text to all open tags', function () {
      const fooNode = createAstNode({ type: 'foo' })
      const barNode = createAstNode({ type: 'bar' })
      this.openTags.add(fooNode, 'file.md', 3)
      this.openTags.add(barNode, 'file.md', 5)
      this.openTags.addText('text')
      const fooResult = this.openTags.popOpenTagFor('foo')
      expect(fooResult.text).to.equal('text')
      const barResult = this.openTags.popOpenTagFor('bar')
      expect(barResult.text).to.equal('text')
    })
  })
})
