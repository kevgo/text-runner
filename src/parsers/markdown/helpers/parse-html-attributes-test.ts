import { expect } from 'chai'
import { parseHtmlAttributes } from './parse-html-attributes'

describe('parseAttributes', function() {
  it('parses attributes', function() {
    const result = parseHtmlAttributes(' src="1.png" width="100" alt="foo bar"')
    expect(result).to.eql({ src: '1.png', width: '100', alt: 'foo bar' })
  })
})
