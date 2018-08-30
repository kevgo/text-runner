// @flow

const AbsoluteFilePath = require('../../../domain-model/absolute-file-path.js')
const getHtmlBlockTag = require('./get-html-block-tag.js')
const { expect } = require('chai')

describe('parseHtmlBlock', function () {
  it('parses opening tags', function () {
    const result = getHtmlBlockTag(
      '<blockquote textrun="HelloWorld">hello</blockquote>',
      new AbsoluteFilePath('file'),
      0
    )
    expect(result).to.eql('blockquote')
  })

  it('parses closing tags', function () {
    const result = getHtmlBlockTag('</a>', new AbsoluteFilePath('file'), 0)
    expect(result).to.eql('/a')
  })
})
