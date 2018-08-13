// @flow

const AbsoluteLink = require('./absolute-link.js')
const { expect } = require('chai')
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

  describe('add', function () {
    it('adds the given link to the given directory link', function () {
      const link = new AbsoluteLink('/one/two/')
      const relativeLink = new RelativeLink('new.md')
      const actual = link.add(relativeLink)
      expect(actual).to.equal('/one/two/new')
    })
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

  describe('rebase', function () {
    it('replaces the old base with the new', function () {
      const link = new AbsoluteLink('/one/two/three.md')
      const actual = link.rebase('/one', '/foo')
      expect(actual.value).to.equal('/foo/two/three.md')
    })
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
})
