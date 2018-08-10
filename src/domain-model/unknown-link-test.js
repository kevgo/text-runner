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
      expect(actual.value).to.equal('/one/foo.md')
    })
    it('returns the absolute link', function () {
      const link = new UnknownLink('/one/two.md')
      const file = new AbsoluteFilePath('/one/two.md')
      const publications = new Publications()
      const actual = link.absolutify(file, publications, '').value
      expect(actual).to.equal('/one/two.md')
    })
  })

  describe('anchor', function () {
    it('returns the anchor of the url', function () {
      const link = new UnknownLink('foo.md#bar')
      expect(link.anchor()).to.equal('bar')
    })
    it('returns an empty string if there is no anchor', function () {
      const link = new UnknownLink('foo.md')
      expect(link.anchor()).to.equal('')
    })
  })
})
