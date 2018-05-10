// @flow

const DetailedFormatter = require('../formatters/detailed-formatter.js')
const DotFormatter = require('../formatters/dot-formatter.js')
const { expect } = require('chai')
const getFormatterClass = require('./get-formatter-class.js')

describe('getFormatterClass', function () {
  it('returns the dot formatter if requested', function () {
    expect(getFormatterClass('dot')).to.equal(DotFormatter)
  })
  it('returns the detailed formatter if requested', function () {
    expect(getFormatterClass('detailed')).to.equal(DetailedFormatter)
  })
})
