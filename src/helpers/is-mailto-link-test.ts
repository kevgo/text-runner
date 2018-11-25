import { expect } from 'chai'
import isMailtoLink from './is-mailto-link'

describe('isMailtoLink', function() {
  const testData = [
    ['mailto:jean-luc.picard@starfleet.gov', true],
    ['foo', false]
  ]
  for (const [link, expected] of testData) {
    it(link as string, function() {
      expect(isMailtoLink(link as string)).to.equal(expected)
    })
  }
})
