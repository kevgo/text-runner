// @flow

const parseAttributes = require('./parse-attributes.js')
const { expect } = require('chai')

describe('parseAttributes', function () {
  it('parses the attributes', function () {
    const result = parseAttributes(
      '<img src="1.png" width="100" height="100">',
      'filename',
      0
    )
    expect(result).to.eql({ src: '1.png', width: '100', height: '100' })
  })

  it('can handle spaces in attributes', function () {
    const result = parseAttributes('<img alt="foo bar">', 'filename', 0)
    expect(result).to.eql({ alt: 'foo bar' })
  })
})
