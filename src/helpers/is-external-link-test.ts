import { expect } from 'chai'
import isExternalLink from './is-external-link'

describe('isExternalLink', function() {
  const testData = [
    ['link without protocol', '//foo.com', true],
    ['link with protocol', 'http://foo.com', true],
    ['absolute link', '/one/two.md', false],
    ['relative link', 'one.md', false],
    ['relative link up', '../one.md', false]
  ]
  for (const [description, link, expected] of testData) {
    it(description as string, function() {
      expect(isExternalLink(link as string)).to.equal(expected)
    })
  }
})
