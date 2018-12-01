import { expect } from 'chai'
import AbsoluteFilePath from '../domain-model/absolute-file-path'
import Publications from './publications'

describe('Publications', function() {
  describe('forFilePath', function() {
    it('returns the publication that publishes the given FilePath', function() {
      const publications = Publications.fromJSON([
        {
          localPath: 'foo',
          publicExtension: '',
          publicPath: ''
        },
        {
          localPath: 'bar',
          publicExtension: '',
          publicPath: ''
        }
      ])
      const filePath = new AbsoluteFilePath('bar')
      const actual: any = publications.forFilePath(filePath) || {}
      expect(actual.localPath).to.equal('/bar/')
    })

    it('returns NULL if no publication matches', function() {
      const publications = Publications.fromJSON([
        {
          localPath: 'foo',
          publicExtension: '',
          publicPath: ''
        }
      ])
      const filePath = new AbsoluteFilePath('bar')
      const actual = publications.forFilePath(filePath)
      expect(actual).to.undefined
    })
  })

  describe('sortPathMappings', function() {
    it('returns the given publications sorted descending by publicPath', function() {
      const original = Publications.fromJSON([
        {
          localPath: '/content/',
          publicExtension: '',
          publicPath: '/'
        },
        {
          localPath: '/content/posts',
          publicExtension: 'html',
          publicPath: '/blog'
        }
      ])
      const actual = original.sorted()
      const expected = Publications.fromJSON([
        {
          localPath: '/content/posts',
          publicExtension: 'html',
          publicPath: '/blog'
        },
        {
          localPath: '/content/',
          publicExtension: '',
          publicPath: '/'
        }
      ])
      expect(actual).to.eql(expected)
    })

    it('works with empty mappings', function() {
      const publications = new Publications()
      expect(publications.sort()).to.eql([])
    })
  })
})
