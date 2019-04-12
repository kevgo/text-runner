import { expect } from 'chai'
import { TagMapper } from './tag-mapper'

const tagMapper = new TagMapper()

describe('TagMapper', () => {
  describe('.tagForType()', () => {
    it('maps known opening tags', () => {
      expect(tagMapper.tagForType('bold_open')).to.equal('b')
    })
    it('maps known closing tags', () => {
      expect(tagMapper.tagForType('bold_close')).to.equal('/b')
    })
    it('maps known standalone tags', () => {
      expect(tagMapper.tagForType('image')).to.equal('img')
    })
    it('maps unknown opening tags', () => {
      expect(tagMapper.tagForType('foo_open')).to.equal('foo')
    })
    it('maps unknown closing tags', () => {
      expect(tagMapper.tagForType('foo_close')).to.equal('/foo')
    })
    it('maps unknown standalone tags', () => {
      expect(tagMapper.tagForType('foo')).to.equal('foo')
    })
  })

  describe('.typeForTag()', () => {
    it('maps known opening tags', () => {
      expect(tagMapper.typeForTag('b')).to.equal('bold_open')
    })
    it('maps known closing tags', () => {
      expect(tagMapper.typeForTag('/b')).to.equal('bold_close')
    })
    it('maps known standalone tags', () => {
      expect(tagMapper.typeForTag('img')).to.equal('image')
    })
    it('maps unknown opening tags', () => {
      expect(tagMapper.typeForTag('foo')).to.equal('foo_open')
    })
    it('maps unknown closing tags', () => {
      expect(tagMapper.typeForTag('/foo')).to.equal('foo_close')
    })
  })
})
