import { expect } from 'chai'
import isAbsolutePath from './is-absolute-path'

describe('isAbsolutePath', function() {
  it('returns true for paths beginning with /', function() {
    expect(isAbsolutePath('/content/foo')).to.be.true
  })
  it('returns true for paths beginning with \\', function() {
    expect(isAbsolutePath('\\content\\foo\\')).to.be.true
  })
  it('returns false for paths beginning with characters', function() {
    expect(isAbsolutePath('content/foo/')).to.be.false
  })
})
