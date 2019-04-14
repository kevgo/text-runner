import { expect } from 'chai'
import { AbsoluteFilePath } from '../../../../domain-model/absolute-file-path'
import { OpenTagTracker } from '../../helpers/open-tag-tracker'
import { RemarkableNode } from '../remarkable-node'
import { TagMapper } from '../tag-mapper'
import { GenericHtmlTagTransformer } from './generic-html-tag-transformer'

const transformer = new GenericHtmlTagTransformer(
  new OpenTagTracker(),
  new TagMapper()
)
const file = new AbsoluteFilePath('foo')
const openingNode = new RemarkableNode()
openingNode.attributes = { class: 'myClass' }
openingNode.content = '<foo class="myClass">'
openingNode.type = 'htmltag'
const closingNode = new RemarkableNode()
closingNode.attributes = {}
closingNode.content = '</foo>'
closingNode.type = 'htmltag'

describe('GenericHtmlTagTransformer', () => {
  //   describe('.transform()', () => {
  //     describe('tranforming opening nodes', () => {
  //       beforeEach(function() {
  //         transformer.transform(openingNode, file, 3)
  //         this.actual = transformer.transformClosingHtmlTag('</foo>', file, 3)
  //       })
  //       it('returns the corresponding AstNode', () => {
  //         expect(this.actual).to.have.length(1)
  //       })
  //       it('assigns the attributes of the opening tag', function() {
  //         expect(this.actual.attributes).to.eql({ class: 'myClass' })
  //       })
  //     })
  //   })

  describe('.transformOpeningHtmlTag()', () => {
    beforeEach(function() {
      this.result = transformer.transformOpeningHtmlTag(openingNode, file, 3)
    })
    it('returns the corresponding AstNode', function() {
      expect(this.result).to.have.length(1)
    })
    it('stores the tag', function() {
      expect(this.result[0].tag).to.eql('foo')
    })
    it('stores the Remarkable type', function() {
      expect(this.result[0].type).to.eql('foo_open')
    })
  })
})
