// @flow

const AbsoluteFilePath = require('./absolute-file-path.js')
const Publications = require('../configuration/publications.js')
const UnknownLink = require('./unknown-link.js')
const { expect } = require('chai')

describe('UnknownLink', function () {
  describe('absolutify', function () {
    it('converts the relative link to an absolute link', function () {
      const link = new UnknownLink('foo.md')
      const file = new AbsoluteFilePath('/one/two.md')
      const publications = new Publications()
      const actual = link.absolutify(file, publications, '')
      expect(actual).to.equal('/one/foo.md')
    })
    it('returns the absolute link', function () {
      const link = new UnknownLink('/one/two.md')
      const file = new AbsoluteFilePath('/one/two.md')
      const publications = new Publications()
      expect(link.absolutify(file, publications, '')).to.equal('/one/two.md')
    })
  })
})
