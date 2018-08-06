// @flow

const relativeToAbsoluteLink = require('./relative-to-absolute-link.js')
const { expect } = require('chai')

describe('relativeToAbsoluteLink', function () {
  it('converts the given link relative to the given file into an absolute link', function () {
    const publications = [
      { localPath: '/content', publicPath: '/', publicExtension: '' }
    ]
    const actual = relativeToAbsoluteLink(
      '2',
      '/content/1.md',
      publications,
      ''
    )
    expect(actual).to.equal('/2')
  })

  it('can go upwards', function () {
    const publications = [
      { localPath: '/content', publicPath: '/', publicExtension: '' }
    ]
    const actual = relativeToAbsoluteLink(
      '../2',
      '/content/foo/bar/1.md',
      publications,
      ''
    )
    expect(actual).to.equal('/foo/2')
  })

  it('works with subdirectories', function () {
    const publications = [
      { localPath: '/posts', publicPath: '/blog', publicExtension: '' }
    ]
    const actual = relativeToAbsoluteLink('2', 'posts/1.md', publications, '')
    expect(actual).to.equal('/blog/2')
  })
})
