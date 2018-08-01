// @flow

const reversePublication = require('./reverse-publication.js')
const { expect } = require('chai')

describe('reversePublication', function () {
  it('applies the given path mapping', function () {
    const publications = [
      { localPath: '/content/', publicPath: '/', publicExtension: '' }
    ]
    const actual = reversePublication('/1.md', publications, '')
    expect(actual).to.equal('/content/1.md')
  })

  it('adds leading slashes to the link', function () {
    const publications = [
      { localPath: '/content/', publicPath: '/', publicExtension: '' }
    ]
    const actual = reversePublication('1.md', publications, '')
    expect(actual).to.equal('/content/1.md')
  })

  it('applies the extension mapping in url-friendly cases', function () {
    const publications = [
      {
        localPath: '/content/',
        publicPath: '/',
        publicExtension: ''
      }
    ]
    const actual = reversePublication('1', publications, '')
    expect(actual).to.equal('/content/1.md')
  })

  it('applies the extension mapping in HTML cases', function () {
    const publications = [
      {
        localPath: '/content/',
        publicPath: '/',
        publicExtension: '.html'
      }
    ]
    const actual = reversePublication('1.html', publications, '')
    expect(actual).to.equal('/content/1.md')
  })

  it('works with empty publications', function () {
    expect(reversePublication('1.md', [], '')).to.equal('/1.md')
  })

  it('uses the given default filename without publications', function () {
    const actual = reversePublication('/posts/', [], 'index.md')
    expect(actual).to.equal('/posts/index.md')
  })

  it('uses the given default filename together with publications', function () {
    const publications = [
      {
        localPath: '/content/',
        publicPath: '/posts',
        publicExtension: ''
      }
    ]
    const actual = reversePublication('/posts/', publications, 'index.md')
    expect(actual).to.equal('/content/index.md')
  })
})
