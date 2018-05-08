// @flow

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
    it('returns the nodes until the given node is closed', function () {
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
  })

  describe('hasNode', function () {
    it('returns true if the list contains the given node type', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'paragraph_open' })
      list.scaffold({ type: 'paragraph_close' })
      expect(list.hasNode('paragraph')).to.be.true
    })
    it('returns false if the list does not contain the given node type', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'paragraph_open' })
      list.scaffold({ type: 'paragraph_close' })
      expect(list.hasNode('code')).to.be.false
    })
  })

  describe('getTextFor', function () {
    it('returns the textual content until the given node is closed', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'paragraph_open' })
      list.scaffold({ type: 'heading_open' })
      list.scaffold({ type: 'text', content: 'foo' })
      list.scaffold({ type: 'text', content: 'bar' })
      list.scaffold({ type: 'heading_close' })
      list.scaffold({ type: 'paragraph_close' })
      const result = list.getTextFor(list[1])
      expect(result).to.equal('foobar')
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

  describe('textInNode', function () {
    it('returns the text of single matching node types', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'code_open' })
      list.scaffold({ type: 'text', content: 'hello' })
      list.scaffold({ type: 'code_close' })
      const result = list.textInNode('code')
      expect(result).to.equal('hello')
    })
    it('allows to provide multiple possible matching nodes', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'code_open' })
      list.scaffold({ type: 'text', content: 'hello' })
      list.scaffold({ type: 'code_close' })
      const result = list.textInNode('code', 'fence')
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
      expect(() => list.textInNode('code', 'fence')).to.throw(
        UnprintedUserError
      )
    })
    it('throws if no matching node exists', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'code_open' })
      list.scaffold({ type: 'text', content: 'hello' })
      list.scaffold({ type: 'code_close' })
      expect(() => list.textInNode('fence')).to.throw(UnprintedUserError)
    })
  })
})
