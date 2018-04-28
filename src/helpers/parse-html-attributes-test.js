// @flow

const parseAttributes = require('./parse-html-attributes.js')
const { expect } = require('chai')

describe('parseAttributes', function () {
  it('parses attributes', function () {
    const result = parseAttributes(' src="1.png" width="100" alt="foo bar"')
    expect(result).to.eql({ src: '1.png', width: '100', alt: 'foo bar' })
  })
})
