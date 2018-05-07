// @flow

const javascriptExtensions = require('./javascript-extensions.js')
const { expect } = require('chai')

describe('javascriptExtensions', function () {
  it('returns all supported JS extensions', function () {
    const result = javascriptExtensions()
    expect(result).to.include('coffee')
    expect(result).to.include('js')
    expect(result).to.include('ts')
  })
})
