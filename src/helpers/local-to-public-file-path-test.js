// @flow

const localToPublicFilePath = require('./local-to-public-path.js')
const { expect } = require('chai')

describe('localToPublicFilePath', function () {
  it('returns the public filepath for the given local filepath', function () {
    const publications = [
      {
        localPath: '/content/',
        publicPath: '/',
        publicExtension: '.html'
      }
    ]
    const actual = localToPublicFilePath('/content/1.md', publications)
    expect(actual).to.equal('/1.html')
  })
})
