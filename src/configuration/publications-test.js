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
})
