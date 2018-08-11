// @flow

const AbsoluteFilePath = require('./absolute-file-path.js')
const Publications = require('../configuration/publications.js')
const RelativeLink = require('./relative-link.js')
const { expect } = require('chai')

describe('RelativeLink', function () {
  describe('absolutify', function () {
    it('converts the relative link an absolute link', function () {
      const publications = Publications.fromJSON([
        { localPath: '/content', publicPath: '/', publicExtension: '' }
      ])
      const link = new RelativeLink('foo.md')
      const containingFile = new AbsoluteFilePath('/one/two.md')
      const actual = link.absolutify(containingFile, publications, '')
      expect(actual.value).to.equal('/one/foo.md')
    })

    it('can go upwards', function () {
      const publications = Publications.fromJSON([
        { localPath: '/content', publicPath: '/', publicExtension: '' }
      ])
      const link = new RelativeLink('../foo.md')
      const containingFile = new AbsoluteFilePath('/one/two.md')
      const actual = link.absolutify(containingFile, publications, '')
      expect(actual.value).to.equal('/foo.md')
    })

    it('works with subdirectories', function () {
      const publications = Publications.fromJSON([
        { localPath: '/posts', publicPath: '/blog', publicExtension: '' }
      ])
      const link = new RelativeLink('foo/bar.md')
      const containingFile = new AbsoluteFilePath('/one/two.md')
      const actual = link.absolutify(containingFile, publications, '')
      expect(actual.value).to.equal('/one/foo/bar.md')
    })
  })
})
