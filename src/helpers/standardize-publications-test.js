// @flow

const standardizePublications = require('./standardize-publications.js')
const { expect } = require('chai')

describe('standardizePublications', function () {
  it('adds leading and trailing slashes to the given paths', function () {
    const publications = [
      {
        localPath: 'content/posts',
        publicPath: 'thinking/stories',
        publicExtension: ''
      }
    ]
    const actual = standardizePublications(publications)
    expect(actual).to.eql([
      {
        localPath: '/content/posts/',
        publicPath: '/thinking/stories/',
        publicExtension: ''
      }
    ])
  })

  it('standardizes extensions', function () {
    const publications = [
      {
        localPath: 'content/posts',
        publicPath: 'thinking/stories',
        publicExtension: 'html'
      }
    ]
    const actual = standardizePublications(publications)
    expect(actual[0].publicExtension).to.eql('.html')
  })

  it('adds the default public extension if none exists', function () {
    const publications = [
      {
        localPath: '',
        publicPath: ''
      }
    ]
    const actual = standardizePublications(publications)
    expect(actual[0].publicExtension).to.eql('.md')
  })
})
