import isMailtoLink from './is-mailto-link.js'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('isMailtoLink', function() {
  const testData = [
    ['mailto:jean-luc.picard@starfleet.gov', true],
    ['foo', false]
  ]
  for (const [link, expected] of testData) {
    it(link, function() {
      expect(isMailtoLink(link as string)).to.equal(expected)
    })
  }
})
