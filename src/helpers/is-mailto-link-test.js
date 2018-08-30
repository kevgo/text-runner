// @flow

const isMailtoLink = require('./is-mailto-link.js')
const { expect } = require('chai')

describe('isMailtoLink', function () {
  const testData = [
    ['mailto:jean-luc.picard@starfleet.gov', true],
    ['foo', false]
  ]
  for (const [link, expected] of testData) {
    it(link, function () {
      expect(isMailtoLink(link)).to.equal(expected)
    })
  }
})
