import openingTagFor from './opening-tag-for'
import { expect } from 'chai'

describe('openingTagFor', function() {
  it('returns the opening tag for closing tags', function() {
    expect(openingTagFor('paragraph_close')).to.eql('paragraph_open')
  })
})
