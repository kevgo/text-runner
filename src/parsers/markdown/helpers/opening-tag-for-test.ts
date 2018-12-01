import { expect } from 'chai'
import openingTagFor from './opening-tag-for'

describe('openingTagFor', function() {
  it('returns the opening tag for closing tags', function() {
    expect(openingTagFor('paragraph_close')).to.eql('paragraph_open')
  })
})
