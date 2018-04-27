// @flow

const openingTagFor = require('./opening-tag-for.js')
const { expect } = require('chai')

describe('openingTagFor', function () {
  it('returns the opening tag for closing tags', function () {
    expect(openingTagFor('paragraph_close')).to.eql('paragraph_open')
  })
})
