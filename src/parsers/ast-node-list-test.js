// @flow
/* eslint no-unused-expressions: 0 */

const AstNode = require('./ast-node.js')
const AstNodeList = require('./ast-node-list.js')
const { expect } = require('chai')
const UnprintedUserError = require('../errors/unprinted-user-error.js')

describe('AstNodeList', function () {
  describe('concat', function () {
    it('adds the nodes in the given list', function () {
      const list1 = new AstNodeList()
      list1.scaffold({ type: 'node1' })
      const list2 = new AstNodeList()
      list1.scaffold({ type: 'node2' })
      list1.concat(list2)
      expect(list1).to.have.length(2)
      expect(list1[0].type).to.equal('node1')
      expect(list1[1].type).to.equal('node2')
    })
  })

  describe('getNodesFor', function () {
    it('returns the nodes until the given opening node is closed', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'paragraph_open' })
      list.scaffold({ type: 'heading_open' })
      list.scaffold({ type: 'text' })
      list.scaffold({ type: 'heading_close' })
      list.scaffold({ type: 'paragraph_close' })
      const result = list.getNodesFor(list[1])
      const types = result.map(node => node.type)
      expect(types).to.eql(['heading_open', 'text', 'heading_close'])
    })
    it('returns the given non-opening node', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'paragraph_open' })
      list.scaffold({ type: 'strongtext', content: 'foo' })
      list.scaffold({ type: 'paragraph_close' })
      const result = list.getNodesFor(list[1])
      const types = result.map(node => node.type)
      expect(types).to.eql(['strongtext'])
    })
  })

  describe('getNodeOfTypes', function () {
    it('returns the node matching any of the given type', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'one' })
      list.scaffold({ type: 'two' })
      list.scaffold({ type: 'three' })
      const result = list.getNodeOfTypes('two', 'four')
      expect(result.type).to.equal('two')
    })
    it('throws for multiple matches', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'one' })
      list.scaffold({ type: 'two' })
      expect(() => list.getNodeOfTypes('one', 'two')).to.throw(
        UnprintedUserError
      )
    })
    it('throws for zero matches', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'one' })
      expect(() => list.getNodeOfTypes('two')).to.throw(UnprintedUserError)
    })
  })

  describe('getNodesOfTypes', function () {
    it('returns all nodes matching any of the given types', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'one' })
      list.scaffold({ type: 'two' })
      list.scaffold({ type: 'three' })
      const result = list.getNodesOfTypes('one', 'three')
      expect(result.map(node => node.type)).to.eql(['one', 'three'])
    })
  })

  describe('textInNode', function () {
    it('returns the textual content until the given node is closed', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'paragraph_open' })
      list.scaffold({ type: 'heading_open' })
      list.scaffold({ type: 'text', content: 'foo' })
      list.scaffold({ type: 'text', content: 'bar' })
      list.scaffold({ type: 'heading_close' })
      list.scaffold({ type: 'paragraph_close' })
      const result = list.textInNode(list[1])
      expect(result).to.equal('foobar')
    })
  })

  describe('hasNodeOfType', function () {
    it('returns true if the list contains the given node type', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'paragraph_open' })
      list.scaffold({ type: 'paragraph_close' })
      expect(list.hasNodeOfType('paragraph')).to.be.true
    })
    it('returns false if the list does not contain the given node type', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'paragraph_open' })
      list.scaffold({ type: 'paragraph_close' })
      expect(list.hasNodeOfType('code')).to.be.false
    })
  })

  describe('iterator', function () {
    it('iterates the nodes', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'node1' })
      list.scaffold({ type: 'node2' })
      const result = new AstNodeList()
      for (const node of list) {
        result.push(node)
      }
      expect(result).to.have.length(2)
      expect(result[0].type).to.equal('node1')
      expect(result[1].type).to.equal('node2')
    })
  })

  describe('nodeTypes', function () {
    it('returns the node types in this list', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'type1' })
      list.scaffold({ type: 'type2' })
      expect(list.nodeTypes()).to.eql(['type1', 'type2'])
    })
  })

  describe('push', function () {
    it('adds the given node to the internal list', function () {
      const list = new AstNodeList()
      const node = AstNode.scaffold()
      list.push(node)
      expect(list).to.have.length(1)
      expect(list[0]).to.equal(node)
    })
  })

  describe('scaffold', function () {
    it('adds a new node with the given attributes', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'heading_open' })
      list.scaffold({ type: 'text' })
      expect(list).to.have.length(2)
      expect(list[0].type).to.eql('heading_open')
      expect(list[1].type).to.eql('text')
    })
  })

  describe('text', function () {
    it('returns all the textual content of the list', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'code_open' })
      list.scaffold({ type: 'text', content: 'hello' })
      list.scaffold({ type: 'code_close' })
      const result = list.text()
      expect(result).to.equal('hello')
    })
  })

  describe('textInNodeOfType', function () {
    it('works with the type name', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'code_open' })
      list.scaffold({ type: 'text', content: 'hello' })
      list.scaffold({ type: 'code_close' })
      const result = list.textInNodeOfType('code')
      expect(result).to.equal('hello')
    })
    it('works with the opening type name', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'code_open' })
      list.scaffold({ type: 'text', content: 'hello' })
      list.scaffold({ type: 'code_close' })
      const result = list.textInNodeOfType('code_open')
      expect(result).to.equal('hello')
    })
    it('allows to provide multiple possible matching nodes', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'code_open' })
      list.scaffold({ type: 'text', content: 'hello' })
      list.scaffold({ type: 'code_close' })
      const result = list.textInNodeOfType('code', 'fence')
      expect(result).to.equal('hello')
    })
    it('throws if multiple matching nodes exist', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'code_open' })
      list.scaffold({ type: 'text', content: 'hello' })
      list.scaffold({ type: 'code_close' })
      list.scaffold({ type: 'fence_open' })
      list.scaffold({ type: 'text', content: 'world' })
      list.scaffold({ type: 'fence_close' })
      expect(() => list.textInNodeOfType('code', 'fence')).to.throw(
        UnprintedUserError
      )
    })
    it('throws if no matching node exists', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'code_open' })
      list.scaffold({ type: 'text', content: 'hello' })
      list.scaffold({ type: 'code_close' })
      expect(() => list.textInNodeOfType('fence')).to.throw(UnprintedUserError)
    })
  })

  describe('textInNodesOfType', function () {
    it('returns the text of all matching nodes', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'strongtext', content: 'foo' })
      list.scaffold({ type: 'strongtext', content: 'bar' })
      const result = list.textInNodesOfType('strongtext')
      expect(result).to.eql(['foo', 'bar'])
    })
  })
})
