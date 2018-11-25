import { expect } from 'chai'
import javascriptExtensions from './javascript-extensions'

describe('javascriptExtensions', function() {
  it('returns all supported JS extensions', function() {
    const result = javascriptExtensions()
    expect(result).to.include('coffee')
    expect(result).to.include('js')
    expect(result).to.include('ts')
  })
})
