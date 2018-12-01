import { expect } from 'chai'
import AbsoluteFilePath from '../domain-model/absolute-file-path'
import AbsoluteLink from '../domain-model/absolute-link'
import Publication from './publication'

describe('Publication', function() {
  describe('resolve', function() {
    it('applies the given path mapping', function() {
      const publication = new Publication('/content', '/', 'html')
      const link = new AbsoluteLink('/1.html')
      const actual = publication.resolve(link, '')
      expect(actual.value).to.equal('content/1.md')
    })

    it('applies the extension mapping for empty public extensions', function() {
      const publication = new Publication('/content', '/', '')
      const link = new AbsoluteLink('/1')
      const actual = publication.resolve(link, '')
      expect(actual.value).to.equal('content/1.md')
    })

    it('applies the extension mapping for custom public extensions', function() {
      const publication = new Publication('/content/', '/', '.html')
      const link = new AbsoluteLink('1.html')
      const actual = publication.resolve(link, '')
      expect(actual.value).to.equal('content/1.md')
    })

    it('adds the given default filename if the link has no filename and an anchor', function() {
      const publication = new Publication('/content/', '/', '')
      const link = new AbsoluteLink('/#hello')
      const actual = publication.resolve(link, 'index.md')
      expect(actual.unixified()).to.equal('content/index.md')
    })

    it('uses the given default filename together with publications', function() {
      const publication = new Publication('/content/', '/posts', '')
      const link = new AbsoluteLink('/posts')
      const actual = publication.resolve(link, 'index.md')
      expect(actual.unixified()).to.equal('content/index.md')
    })
  })

  describe('resolves', function() {
    it('returns TRUE if the link matches', function() {
      const publication = new Publication('/content', '/foo', '')
      const link = new AbsoluteLink('/foo/bar')
      expect(publication.resolves(link)).to.be.true
    })
    it('returns FALSE if the link does not match', function() {
      const publication = new Publication('/content', '/foo', '')
      const link = new AbsoluteLink('/one/two')
      expect(publication.resolves(link)).to.be.false
    })
  })

  describe('publish', function() {
    it('returns the public path of the given file path according to its matching rules', function() {
      const publication = new Publication('/content', '/', '.html')
      const filePath = new AbsoluteFilePath('content/1.md')
      const link = publication.publish(filePath)
      expect(link.value).to.equal('/1.html')
    })
  })

  describe('publishes', function() {
    it('returns TRUE if it contains the given filePath exactly', function() {
      const filePath = new AbsoluteFilePath('/foo/bar')
      const publication = new Publication('/foo/bar', '', '')
      expect(publication.publishes(filePath)).to.be.true
    })
    it('returns TRUE if it contains the given filePath and more', function() {
      const filePath = new AbsoluteFilePath('/foo/bar/baz')
      const publication = new Publication('/foo/bar', '', '')
      expect(publication.publishes(filePath)).to.be.true
    })
    it('returns FALSE if it does not contain the given filePath', function() {
      const filePath = new AbsoluteFilePath('foo/bar/baz')
      const publication = new Publication('foo/other', '', '')
      expect(publication.publishes(filePath)).to.be.false
    })
  })

  describe('resolve', function() {
    it('returns the filesystem path for the given link', function() {
      const publication = new Publication('/content/posts', '/blog', 'html')
      const link = new AbsoluteLink('/one/two.html')
      const actual = publication.resolve(link, '')
      expect(actual.value).to.equal('one/two.md')
    })
    it('applies the publication data', function() {
      const publication = new Publication('/content/posts', '/blog', 'html')
      const link = new AbsoluteLink('/blog/one.html')
      const actual = publication.resolve(link, '')
      expect(actual.value).to.equal('content/posts/one.md')
    })
    it('removes anchors', function() {
      const publication = new Publication('/content/posts', '/blog', 'html')
      const link = new AbsoluteLink('/one/two.html#hello')
      const actual = publication.resolve(link, '')
      expect(actual.value).to.equal('one/two.md')
    })
  })
})
