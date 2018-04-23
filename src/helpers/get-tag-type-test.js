// @flow

const getTagType = require('./get-tag-type.js')
const { expect } = require('chai')

describe('getTagType', function () {
  it('returns the name of the given HTML tag', function () {
    const examples = {
      '<h1>': 'h1',
      '<h1 textrun="foo">': 'h1'
    }
    for (let text in examples) {
      expect(getTagType(text)).to.equal(examples[text])
    }
  })
})
