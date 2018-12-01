import { expect } from 'chai'
import isLinkToAnchorInOtherFile from './is-link-to-anchor-in-other-file'

describe('isLinkToAnchorInOtherFile', function() {
  const testData = [
    ['link to anchor in other file', 'foo.md#bar', true],
    ['link to anchor in same file', '#foo', false],
    ['link to other file', 'foo.md', false],
    ['external link', 'https://foo.com/bar', false],
    ['external link with anchor', 'https://foo.com/bar#baz', false]
  ]
  for (const [description, link, expected] of testData) {
    it(description as string, function() {
      expect(isLinkToAnchorInOtherFile(link as string)).to.equal(expected)
    })
  }
})
