// @flow

const isLinkToAnchorInOtherFile = require('./is-link-to-anchor-in-other-file.js')
const { expect } = require('chai')

describe('isLinkToAnchorInOtherFile', function () {
  const testData = [
    ['link to anchor in other file', 'foo.md#bar', true],
    ['link to anchor in same file', '#foo', false],
    ['link to other file', 'foo.md', false]
  ]
  for (const [description, link, expected] of testData) {
    it(description, function () {
      expect(isLinkToAnchorInOtherFile(link)).to.equal(expected)
    })
  }
})
