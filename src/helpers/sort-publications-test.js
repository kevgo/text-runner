// @flow

import type { Publications } from '../configuration/configuration.js'

const sortPathMappings = require('./sort-publications.js')
const { expect } = require('chai')

describe('sortPathMappings', function () {
  it('returns the given mappings, sorted descending by publicPath', function () {
    const original: Publications = [
      {
        localPath: '/content/',
        publicPath: '/',
        publicExtension: ''
      },
      {
        localPath: '/content/posts',
        publicPath: '/blog',
        publicExtension: 'html'
      }
    ]
    const actual = sortPathMappings(original)
    const expected: Publications = [
      {
        localPath: '/content/posts',
        publicPath: '/blog',
        publicExtension: 'html'
      },
      {
        localPath: '/content/',
        publicPath: '/',
        publicExtension: ''
      }
    ]
    expect(actual).to.eql(expected)
  })

  it('works with empty mappings', function () {
    expect(sortPathMappings([])).to.eql([])
  })
})
