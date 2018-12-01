import { expect } from 'chai'
import DetailedFormatter from '../formatters/detailed-formatter'
import DotFormatter from '../formatters/dot-formatter'
import getFormatterClass from './get-formatter-class'

describe('getFormatterClass', function() {
  it('returns the dot formatter if requested', function() {
    expect(getFormatterClass('dot', DetailedFormatter)).to.equal(DotFormatter)
  })
  it('returns the detailed formatter if requested', function() {
    expect(getFormatterClass('detailed', DotFormatter)).to.equal(
      DetailedFormatter
    )
  })
  it('returns the default formatter if no name is given', function() {
    expect(getFormatterClass('', DotFormatter)).to.equal(DotFormatter)
  })
})
