// @flow

const parseAttributes = require('./parse-html-tag.js')
const { expect } = require('chai')

describe('parseHtmlBlock', function () {
  it('parses blockquotes', function () {
    const result = parseAttributes(
      '<blockquote textrun="HelloWorld">hello</blockquote>',
      'file',
      0
    )
    expect(result).to.eql('blockquote')
  })
})
