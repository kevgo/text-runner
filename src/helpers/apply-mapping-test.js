// @flow

const applyMapping = require('./apply-mapping.js')
const { expect } = require('chai')

describe('applyMapping', function () {
  context('given no mappings', function () {
    it('returns the given path', function () {
      const actual = applyMapping('foo/bar', [])
      expect(actual).to.equal('foo/bar')
    })
  })

  context('with root directory mapping', function () {
    it('returns the mapped path', function () {
      const mappings = [['/content/', '/']]
      const actual = applyMapping('/foo/bar', mappings)
      expect(actual).to.equal('/content/foo/bar')
    })
  })

  context('with subdirectory mapping', function () {
    it('returns the mapped path', function () {
      const mappings = [['/content', '/site']]
      const actual = applyMapping('/site/bar', mappings)
      expect(actual).to.equal('/content/bar')
    })
  })

  context('with multiple mappings given', function () {
    it('applies the most specific mapping', function () {
      const mappings = [['/content/posts', '/one'], ['/foo', '/']]
      const actual = applyMapping('/one/bar', mappings)
      expect(actual).to.equal('/content/posts/bar')
    })
  })
})
