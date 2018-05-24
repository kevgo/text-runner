// @flow

const { expect } = require('chai')
const removeExcludedFiles = require('./remove-excluded-files.js')

describe('removeExcludedFiles', function () {
  it('removes the given filename', function () {
    const result = removeExcludedFiles(['one', 'two'], 'one')
    expect(result).to.eql(['two'])
  })
  it('removes the given filenames', function () {
    const result = removeExcludedFiles(
      ['one', 'two', 'three'],
      ['one', 'three']
    )
    expect(result).to.eql(['two'])
  })
  it('removes the given regex', function () {
    const result = removeExcludedFiles(['one', 'two'], 'on.')
    expect(result).to.eql(['two'])
  })
  it('removes the given regexes', function () {
    const result = removeExcludedFiles(['one', 'two', 'three'], ['on.', 'thr*'])
    expect(result).to.eql(['two'])
  })
  it('does not remove things if no excludes are given', function () {
    const result = removeExcludedFiles(['one'], [])
    expect(result).to.eql(['one'])
  })
  it('automatically ignores node_modules', function () {
    const result = removeExcludedFiles(
      ['one', 'node_modules/zonk/broken.md'],
      'one'
    )
    expect(result).to.eql([])
  })
})
