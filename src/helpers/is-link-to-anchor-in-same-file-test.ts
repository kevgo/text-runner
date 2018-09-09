import isLinkToAnchorInSameFile from './is-link-to-anchor-in-same-file.js'
import { expect } from 'chai'

describe('isLinkToAnchorInSameFile', function() {
  const testData = [
    ['link to anchor in same file', '#foo', true],
    ['link to anchor in other file', 'foo#bar', false],
    ['link to other file', 'foo.md', false]
  ]
  for (const [description, link, expected] of testData) {
    it(description, function() {
      expect(isLinkToAnchorInSameFile(link)).to.equal(expected)
    })
  }
})
