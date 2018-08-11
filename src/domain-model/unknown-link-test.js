// @flow
/* eslint no-unused-expressions: 0 */

const AbsoluteFilePath = require('./absolute-file-path.js')
const Publications = require('../configuration/publications.js')
const UnknownLink = require('./unknown-link.js')
const { expect } = require('chai')

describe('UnknownLink', function () {
  describe('absolutify', function () {
    it('returns the absolute version of the current relative link', function () {
      const link = new UnknownLink('foo/bar.md')
      const containingFile = new AbsoluteFilePath('/dir/file.md')
      const publications = new Publications()
      expect(link.absolutify(containingFile, publications, '').value).to.equal(
        '/dir/foo/bar.md'
      )
    })
    it('returns the current absolute link', function () {
      const link = new UnknownLink('/foo/bar.md')
      const containingFile = new AbsoluteFilePath('/dir/file.md')
      const publications = new Publications()
      expect(link.absolutify(containingFile, publications, '').value).to.equal(
        '/foo/bar.md'
      )
    })
  })

  describe('isAbsoluteLink', function () {
    it('returns TRUE if the link is absolute', function () {
      const link = new UnknownLink('/foo/bar')
      expect(link.isAbsolute()).to.be.true
    })
    it('returns FALSE if the link is relative', function () {
      const link = new UnknownLink('foo/bar')
      expect(link.isAbsolute()).to.be.false
    })
    it('returns FALSE if the link goes up', function () {
      const link = new UnknownLink('../foo/bar')
      expect(link.isAbsolute()).to.be.false
    })
  })
})
