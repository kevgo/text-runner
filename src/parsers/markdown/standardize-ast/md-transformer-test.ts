import { expect } from 'chai'
import { MdTransformer } from './md-transformer'

describe('MdTransformer', function() {
  beforeEach(function() {
    this.mdTransformer = new MdTransformer()
  })

  describe('.canTransform()', function() {
    it('can transform bullet-list-open', function() {
      expect(this.mdTransformer.canTransform('bullet-list-open')).to.be.true
    })
  })

  describe('.transform()', function() {
    it('transforms bullet-list-open', function() {
      const node = { type: 'bullet-list-open' }
      const transformed = this.mdTransformer.transform(node, 'file.js', 12)
      expect(transformed).to.have.length(1)
      expect(transformed[0]).to.eql({
        attributes: {},
        content: '',
        file: { value: 'file.js' }, // this is an AbsoluteFilePath
        line: 12,
        tag: 'ul',
        type: 'bullet-list-open'
      })
    })
  })
})
