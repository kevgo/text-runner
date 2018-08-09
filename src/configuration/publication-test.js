// @flow
/* eslint no-unused-expressions: 0 */

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const AbsoluteLink = require('../domain-model/absolute-link.js')
const Publication = require('./publication.js')
const { expect } = require('chai')

describe('Publication', function () {
  describe('resolve', function () {
    it('returns the filePath for the given link')
    it('returns the filePath+defaultFile for links to folders with anchor')
  })

  describe('resolves', function () {
    it('returns TRUE if the link matches', function () {
      const publication = new Publication('/content', '/foo', '')
      const link = new AbsoluteLink('/foo/bar')
      expect(publication.resolves(link)).to.be.true
    })
    it('returns FALSE if the link does not match', function () {
      const publication = new Publication('/content', '/foo', '')
      const link = new AbsoluteLink('/one/two')
      expect(publication.resolves(link)).to.be.false
    })
  })

  describe('publish', function () {
    it('returns the public path of the given file path according to its matching rules', function () {
      const publication = new Publication('/content', '/', '.html')
      const filePath = new AbsoluteFilePath('/content/1.md')
      const link = publication.publish(filePath)
      expect(link.value).to.equal('/1.html')
    })
  })

  describe('publishes', function () {
    it('returns TRUE if it contains the given filePath exactly', function () {
      const filePath = new AbsoluteFilePath('/foo/bar')
      const publication = new Publication('/foo/bar', '', '')
      expect(publication.publishes(filePath)).to.be.true
    })
    it('returns TRUE if it contains the given filePath and more', function () {
      const filePath = new AbsoluteFilePath('/foo/bar/baz')
      const publication = new Publication('/foo/bar', '', '')
      expect(publication.publishes(filePath)).to.be.true
    })
    it('returns FALSE if it does not contain the given filePath', function () {
      const filePath = new AbsoluteFilePath('foo/bar/baz')
      const publication = new Publication('foo/other', '', '')
      expect(publication.publishes(filePath)).to.be.false
    })
  })
})
