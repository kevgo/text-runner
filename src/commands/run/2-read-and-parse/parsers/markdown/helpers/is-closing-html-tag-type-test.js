// @flow

const isClosingHtmlTagType = require('./is-closing-html-tag-type.js')
const { expect } = require('chai')

describe('isClosingHtmlTagType', function () {
  const testData = {
    '/a': true,
    '/code': true,
    a: false,
    code: false
  }
  for (let input in testData) {
    const expected = testData[input]
    it(`returns ${expected} for ${input}`, function () {
      expect(isClosingHtmlTagType(input)).to.equal(expected)
    })
  }
})
