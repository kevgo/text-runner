// @flow

const addLeadingDot = require('./add-leading-dot-unless-empty.js')
const { expect } = require('chai')

describe('addLeadingDotUnlessEmpty', function () {
  it('adds a leading dot if there isnt one', function () {
    expect(addLeadingDot('foo')).to.equal('.foo')
  })
  it('does not add another leading dot if there is one', function () {
    expect(addLeadingDot('.foo')).to.equal('.foo')
  })
  it('does not add a leading dot if the string is empty', function () {
    expect(addLeadingDot('')).to.equal('')
  })
})
