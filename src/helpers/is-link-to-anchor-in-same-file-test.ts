import { expect } from 'chai'
import isLinkToAnchorInSameFile from './is-link-to-anchor-in-same-file'

describe('isLinkToAnchorInSameFile', function() {
  const testData = [
    ['link to anchor in same file', '#foo', true],
    ['link to anchor in other file', 'foo#bar', false],
    ['link to other file', 'foo.md', false]
  ]
  for (const [description, link, expected] of testData) {
    it(description as string, function() {
      expect(isLinkToAnchorInSameFile(link as string)).to.equal(expected)
    })
  }
})
