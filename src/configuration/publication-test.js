// @flow
/* eslint no-unused-expressions: 0 */

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const AbsoluteLink = require('../domain-model/absolute-link.js')
const Publication = require('./publication.js')
const { expect } = require('chai')

describe('Publication', function () {
  describe('resolve', function () {
    it('applies the given path mapping', function () {
      const publication = new Publication('/content', '/', '')
      const link = new AbsoluteLink('/1.md')
      const actual = publication.resolve(link, '')
      expect(actual).to.equal('/content/1.md')
    })

    it('applies the extension mapping for empty public extensions', function () {
      const publication = new Publication('/content', '/', '')
      const link = new AbsoluteLink('/1')
      const actual = publication.resolve(link, '')
      expect(actual).to.equal('/content/1.md')
    })

    it('applies the extension mapping for custom public extensions', function () {
      const publication = new Publication('/content/', '/', '.html')
      const link = new AbsoluteLink('1.html')
      const actual = publication.resolve(link, '')
      expect(actual).to.equal('/content/1.md')
    })

    it('adds the given default filename if the link has no filename and an anchor', function () {
      const actual = publication.resolve('/posts/', 'index.md')
      expect(unixifyPath(actual)).to.equal('/posts/index.md')
    })

    it('uses the given default filename together with publications', function () {
      const publications = [
        {
          localPath: '/content/',
          publicPath: '/posts',
          publicExtension: ''
        }
      ]
      const actual = publicToLocalFilePath('/posts/', publications, 'index.md')
      expect(unixifyPath(actual)).to.equal('/content/index.md')
    })
  })
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
