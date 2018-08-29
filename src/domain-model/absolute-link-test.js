// @flow
/* eslint no-unused-expressions: 0 */

const AbsoluteLink = require('./absolute-link.js')
const { expect } = require('chai')
const Publications = require('../configuration/publications.js')
const RelativeLink = require('./relative-link.js')

describe('AbsoluteLink', function () {
  it('prepends a forward slash', function () {
    const link = new AbsoluteLink('foo/bar')
    expect(link.value).to.equal('/foo/bar')
  })

  it('converts Windows paths to forward slashes', function () {
    const link = new AbsoluteLink('\\foo\\bar')
    expect(link.value).to.equal('/foo/bar')
  })

  describe('anchor', function () {
    const tests = [
      ['link with anchor', '/foo.md#hello', 'hello'],
      ['link without anchor', '/foo.md', '']
    ]
    for (const [description, link, expected] of tests) {
      it(description, function () {
        const absoluteLinklink = new AbsoluteLink(link)
        expect(absoluteLinklink.anchor()).to.equal(expected)
      })
    }
  })

  describe('append', function () {
    it('adds the given link to the given directory link', function () {
      const link = new AbsoluteLink('/one/two/')
      const relativeLink = new RelativeLink('new.md')
      const actual = link.append(relativeLink)
      expect(actual.value).to.equal('/one/two/new.md')
    })
    it('straightens out the path', function () {
      const link = new AbsoluteLink('/one/two')
      const appended = link.append(new RelativeLink('../new'))
      expect(appended.value).to.equal('/one/new')
    })
  })

  describe('directory', function () {
    const testData = [
      ['returns the directory of the given filename', '/dir/file.md', '/dir/'],
      ['returns the given directory', '/dir/', '/dir/']
    ]
    for (const [description, url, expected] of testData) {
      it(description, function () {
        const link = new AbsoluteLink(url)
        expect(link.directory().value).to.equal(expected)
      })
    }
  })

  describe('hasAnchor', function () {
    it('returns TRUE if the link points to a file with anchor', function () {
      const link = new AbsoluteLink('/one.md#hello')
      expect(link.hasAnchor()).to.be.true
    })
    it('returns TRUE if the link points to a directory with anchor', function () {
      const link = new AbsoluteLink('/#hello')
      expect(link.hasAnchor()).to.be.true
    })
    it('returns FALSE if the link points to a file without anchor', function () {
      const link = new AbsoluteLink('/one.md')
      expect(link.hasAnchor()).to.be.false
    })
    it('returns FALSE if the link points to a directory without anchor', function () {
      const link = new AbsoluteLink('/')
      expect(link.hasAnchor()).to.be.false
    })
  })

  describe('hasExtension', function () {
    it('returns TRUE if the link has the given extension with period', function () {
      const link = new AbsoluteLink('/foo.md')
      expect(link.hasExtension('.md')).to.be.true
    })
    it('returns TRUE if the link has the given extension without period', function () {
      const link = new AbsoluteLink('/foo.md')
      expect(link.hasExtension('md')).to.be.true
    })
    it('returns TRUE for matches with empty extension', function () {
      const link = new AbsoluteLink('/foo')
      expect(link.hasExtension('')).to.be.true
    })
    it('returns FALSE if the link has a different extension', function () {
      const link = new AbsoluteLink('/foo/bar.html')
      expect(link.hasExtension('md')).to.be.false
    })
    it('returns FALSE if the link has no extension', function () {
      const link = new AbsoluteLink('/foo/bar')
      expect(link.hasExtension('md')).to.be.false
    })
  })

  describe('isLinkToDirectory', function () {
    it('returns TRUE if the link points to a directory', function () {
      const link = new AbsoluteLink('/foo/')
      expect(link.isLinkToDirectory()).to.be.true
    })
    it('returns FALSE if the link does not point to a directory', function () {
      const link = new AbsoluteLink('/foo/bar.md')
      expect(link.isLinkToDirectory()).to.be.false
    })
  })

  describe('localize', function () {
    it('returns the local file path of this link', function () {
      const link = new AbsoluteLink('/one/two.png')
      const publications = new Publications()
      const actual = link.localize(publications, '')
      expect(actual.value).to.equal('one/two.png')
    })
    it('url-decodes the file path', function () {
      const link = new AbsoluteLink('/one%20two.png')
      const publications = new Publications()
      const actual = link.localize(publications, '')
      expect(actual.value).to.equal('one two.png')
    })
    it('applies the publication', function () {
      const link = new AbsoluteLink('/blog/two.html')
      const publications = Publications.fromJSON([
        {
          localPath: '/content/posts',
          publicPath: '/blog',
          publicExtension: 'html'
        }
      ])
      const actual = link.localize(publications, '')
      expect(actual.value).to.equal('content/posts/two.md')
    })
    it('removes the anchor in publications', function () {
      const link = new AbsoluteLink('/blog/two.html#hello')
      const publications = Publications.fromJSON([
        {
          localPath: '/content/posts',
          publicPath: '/blog',
          publicExtension: 'html'
        }
      ])
      const actual = link.localize(publications, '')
      expect(actual.value).to.equal('content/posts/two.md')
    })
    it('removes the anchor in non-published links', function () {
      const link = new AbsoluteLink('/one/two.md#hello')
      const publications = new Publications()
      const actual = link.localize(publications, '')
      expect(actual.value).to.equal('one/two.md')
    })
  })

  describe('urlDecoded', function () {
    it('returns the link url decoded', function () {
      const link = new AbsoluteLink('/one%20two.png')
      const publications = new Publications()
      const actual = link.localize(publications, '')
      expect(actual.value).to.equal('one two.png')
    })
  })

  describe('rebase', function () {
    it('replaces the old base with the new', function () {
      const link = new AbsoluteLink('/one/two/three.md')
      const actual = link.rebase('/one', '/foo')
      expect(actual.value).to.equal('/foo/two/three.md')
    })
  })

  describe('withAnchor', function () {
    const tests = [
      ['link with anchor', '/foo.md#hello', 'new', '/foo.md#new'],
      ['link without anchor', '/foo.md', 'new', '/foo.md#new']
    ]
    for (const [description, url, anchor, expected] of tests) {
      it(description, function () {
        const link = new AbsoluteLink(url)
        expect(link.withAnchor(anchor).value).to.equal(expected)
      })
    }
  })

  describe('withExtension', function () {
    it('returns a new AbsoluteLink with the given file extension without dot', function () {
      const link = new AbsoluteLink('foo.txt')
      const actual = link.withExtension('md')
      expect(actual.value).to.equal('/foo.md')
    })

    it('returns a new AbsoluteLink with the given file extension with dot', function () {
      const link = new AbsoluteLink('foo.txt')
      const actual = link.withExtension('.md')
      expect(actual.value).to.equal('/foo.md')
    })
  })

  describe('withoutAnchor', function () {
    const tests = [
      ['link with anchor', '/foo.md#hello', '/foo.md'],
      ['link without anchor', '/foo.md', '/foo.md']
    ]
    for (const [description, url, expected] of tests) {
      it(description, function () {
        const link = new AbsoluteLink(url)
        expect(link.withoutAnchor().value).to.equal(expected)
      })
    }
  })
})
