// @flow
/* eslint no-unused-expressions: 0 */

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const Publications = require('./publications.js')
const { expect } = require('chai')

describe('Publications', function () {
  describe('forFilePath', function () {
    it('returns the publication that publishes the given FilePath', function () {
      const publications = Publications.fromJSON([
        {
          localPath: 'foo',
          publicPath: '',
          publicExtension: ''
        },
        {
          localPath: 'bar',
          publicPath: '',
          publicExtension: ''
        }
      ])
      const filePath = new AbsoluteFilePath('bar')
      const actual = publications.forFilePath(filePath)
      // $FlowFixMe: no type checking needed here
      expect(actual.localPath).to.equal('/bar/')
    })

    it('returns NULL if no publication matches', function () {
      const publications = Publications.fromJSON([
        {
          localPath: 'foo',
          publicPath: '',
          publicExtension: ''
        }
      ])
      const filePath = new AbsoluteFilePath('bar')
      const actual = publications.forFilePath(filePath)
      expect(actual).to.undefined
    })
  })

  describe('sortPathMappings', function () {
    it('returns the given publications sorted descending by publicPath', function () {
      const original = Publications.fromJSON([
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
      ])
      const actual = original.sorted()
      const expected = Publications.fromJSON([
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
      ])
      expect(actual).to.eql(expected)
    })

    it('works with empty mappings', function () {
      const publications = new Publications()
      expect(publications.sort()).to.eql([])
    })
  })
})
