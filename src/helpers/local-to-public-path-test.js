// @flow

const getPublicPath = require('./local-to-public-path.js')
const { expect } = require('chai')

describe('getPublicPath', function () {
  it('returns the public path for the given local path', function () {
    const publications = [
      {
        localPath: '/content/',
        publicPath: '/',
        publicExtension: ''
      }
    ]
    const actual = getPublicPath('/content/1.md', publications)
    expect(actual).to.equal('/1.md')
  })
})
