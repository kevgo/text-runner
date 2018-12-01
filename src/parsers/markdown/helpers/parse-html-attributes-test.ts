import { expect } from 'chai'
import parseAttributes from './parse-html-attributes'

describe('parseAttributes', function() {
  it('parses attributes', function() {
    const result = parseAttributes(' src="1.png" width="100" alt="foo bar"')
    expect(result).to.eql({ src: '1.png', width: '100', alt: 'foo bar' })
  })
})
