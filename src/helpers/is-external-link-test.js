// @flow

const isExternalLink = require('./is-external-link.js')
const { expect } = require('chai')

describe('isExternalLink', function () {
  const testData = [
    ['link without protocol', '//foo.com', true],
    ['link with protocol', 'http://foo.com', true],
    ['absolute link', '/one/two.md', false],
    ['relative link', 'one.md', false],
    ['relative link up', '../one.md', false]
  ]
  for (const [description, link, expected] of testData) {
    it(description, function () {
      expect(isExternalLink(link)).to.equal(expected)
    })
  }
})
