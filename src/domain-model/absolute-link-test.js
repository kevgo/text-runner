// @flow

const AbsoluteLink = require('./absolute-link.js')
const { expect } = require('chai')

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

  describe('add', function () {
    it('adds the given link to the given directory link')
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
