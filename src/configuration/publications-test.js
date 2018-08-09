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
          filePath: 'foo',
          urlPath: ''
        },
        {
          filePath: 'bar',
          urlPath: ''
        }
      ])
      const filePath = new AbsoluteFilePath('bar')
      const actual = publications.forFilePath(filePath)
      // $FlowFixMe: flow is stupid
      expect(actual.filePath).to.equal('bar')
    })

    it('returns NULL if no publication matches', function () {
      const publications = Publications.fromJSON([
        {
          filePath: 'foo',
          urlPath: ''
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
          filePath: '/content/',
          urlPath: '/',
          urlExtension: ''
        },
        {
          filePath: '/content/posts',
          urlPath: '/blog',
          urlExtension: 'html'
        }
      ])
      const actual = original.sorted()
      const expected = Publications.fromJSON([
        {
          filePath: '/content/posts',
          urlPath: '/blog',
          urlExtension: 'html'
        },
        {
          filePath: '/content/',
          urlPath: '/',
          urlExtension: ''
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
