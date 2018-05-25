// @flow

const AstNodeList = require('../parsers/ast-node-list.js')
const { expect } = require('chai')
const LinkTargetList = require('./link-target-list.js')

describe('LinkTargetList', function () {
  describe('addNodeList', function () {
    it('adds the anchors in the given AstNodeList', function () {
      const nodeList = new AstNodeList()
      nodeList.scaffold({
        file: 'file.md',
        type: 'anchor_open',
        attributes: { name: 'foo bar' }
      })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      expect(targetList.targets).to.eql({
        'file.md': [{ type: 'anchor', name: 'foo-bar' }]
      })
    })

    it('registers files even if they do not contain link targets', function () {
      const nodeList = new AstNodeList()
      nodeList.scaffold({
        file: 'file.md',
        type: 'text'
      })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      expect(targetList.targets).to.eql({
        'file.md': []
      })
    })

    it('adds the headings in the given AstNodeList', function () {
      const nodeList = new AstNodeList()
      nodeList.scaffold({
        file: 'file.md',
        type: 'heading_open',
        attributes: {}
      })
      nodeList.scaffold({
        file: 'file.md',
        type: 'text',
        content: 'foo bar'
      })
      nodeList.scaffold({
        file: 'file.md',
        type: 'heading_close'
      })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      expect(targetList.targets).to.eql({
        'file.md': [{ type: 'heading', name: 'foo-bar' }]
      })
    })
  })
})
