// @flow

const getHtmlBlockTag = require('./get-html-block-tag.js')
const { expect } = require('chai')

describe('parseHtmlBlock', function () {
  it('parses opening tags', function () {
    const result = getHtmlBlockTag(
      '<blockquote textrun="HelloWorld">hello</blockquote>',
      'file',
      0
    )
    expect(result).to.eql('blockquote')
  })

  it('parses closing tags', function () {
    const result = getHtmlBlockTag('</a>', 'file', 0)
    expect(result).to.eql('/a')
  })
})
