import { expect } from 'chai'
import AbsoluteFilePath from '../domain-model/absolute-file-path'
import AstNodeList from '../parsers/ast-node-list'
import LinkTargetList from './link-target-list'

describe('LinkTargetList', function() {
  describe('addNodeList', function() {
    it('adds the anchors in the given AstNodeList', function() {
      const nodeList = AstNodeList.scaffold({
        attributes: { name: 'foo bar' },
        file: 'file.md',
        type: 'anchor_open'
      })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      const actual = targetList.hasAnchor(
        new AbsoluteFilePath('file.md'),
        'foo-bar'
      )
      expect(actual).to.be.true
    })

    it('registers files even if they do not contain link targets', function() {
      const nodeList = AstNodeList.scaffold({ file: 'file.md', type: 'text' })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      expect(targetList.hasFile(new AbsoluteFilePath('file.md'))).to.be.true
    })

    it('adds the headings in the given AstNodeList', function() {
      const nodeList = new AstNodeList()
      nodeList.pushNode({
        attributes: {},
        file: 'file.md',
        type: 'heading_open'
      })
      nodeList.pushNode({
        content: 'foo bar',
        file: 'file.md',
        type: 'text'
      })
      nodeList.pushNode({
        file: 'file.md',
        type: 'heading_close'
      })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      const filePath = new AbsoluteFilePath('file.md')
      expect(targetList.hasAnchor(filePath, 'foo-bar')).to.be.true
    })
  })

  describe('anchorType', function() {
    it('returns "heading" for headings', function() {
      const nodeList = new AstNodeList()
      nodeList.pushNode({
        attributes: {},
        file: 'file.md',
        type: 'heading_open'
      })
      nodeList.pushNode({
        content: 'foo bar',
        file: 'file.md',
        type: 'text'
      })
      nodeList.pushNode({
        file: 'file.md',
        type: 'heading_close'
      })
      const list = new LinkTargetList()
      list.addHeading(nodeList[0], nodeList)
      const filePath = new AbsoluteFilePath('file.md')
      expect(list.anchorType(filePath, 'foo-bar')).to.equal('heading')
    })
    it('returns "anchor" for HTML anchors', function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath('foo.md')
      list.addLinkTarget(filePath, 'anchor', 'hello')
      expect(list.anchorType(filePath, 'hello')).to.equal('anchor')
    })
  })

  describe('hasAnchor', function() {
    it('returns TRUE if the given anchor exists', function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath('foo.md')
      list.addLinkTarget(filePath, 'heading', 'hello')
      expect(list.hasAnchor(filePath, 'hello')).to.be.true
    })
    it('returns FALSE if the given anchor does not exist in the file', function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath('foo.md')
      list.addLinkTarget(filePath, 'heading', 'hello')
      expect(list.hasAnchor(filePath, 'zonk')).to.be.false
    })
    it('returns FALSE if the given file does not exist', function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath('zonk.md')
      expect(list.hasAnchor(filePath, 'foo')).to.be.false
    })
  })

  describe('hasFile', function() {
    it('returns TRUE if the list contains the file with anchors', function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath('foo.md')
      list.addLinkTarget(filePath, 'heading', 'hello')
      expect(list.hasFile(filePath)).to.be.true
    })
    it('returns TRUE if the list contains the file without anchors', function() {
      const nodeList = AstNodeList.scaffold({ file: 'file.md', type: 'text' })
      const targetList = new LinkTargetList()
      targetList.addNodeList(nodeList)
      expect(targetList.hasFile(new AbsoluteFilePath('file.md'))).to.be.true
    })
    it('returns FALSE if the list does not contain the file', function() {
      const list = new LinkTargetList()
      const filePath = new AbsoluteFilePath('foo.md')
      expect(list.hasFile(filePath)).to.be.false
    })
  })
})
