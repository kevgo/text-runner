import { expect } from 'chai'
import AbsoluteFilePath from '../../../domain-model/absolute-file-path'
import getHtmlBlockTag from './get-html-block-tag'

describe('parseHtmlBlock', function() {
  it('parses opening tags', function() {
    const result = getHtmlBlockTag(
      '<blockquote textrun="HelloWorld">hello</blockquote>',
      new AbsoluteFilePath('file'),
      0
    )
    expect(result).to.eql('blockquote')
  })

  it('parses closing tags', function() {
    const result = getHtmlBlockTag('</a>', new AbsoluteFilePath('file'), 0)
    expect(result).to.eql('/a')
  })
})
