// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const { expect } = require('chai')
const removeExcludedFiles = require('./remove-excluded-files.js')

describe('removeExcludedFiles', function () {
  it('removes the given filename', function () {
    const result = removeExcludedFiles(
      [new AbsoluteFilePath('one'), new AbsoluteFilePath('two')],
      'one'
    )
    expect(result).to.eql([{ value: 'two' }])
  })
  it('removes the given filenames', function () {
    const result = removeExcludedFiles(
      [
        new AbsoluteFilePath('one'),
        new AbsoluteFilePath('two'),
        new AbsoluteFilePath('three')
      ],
      ['one', 'three']
    )
    expect(result).to.eql([{ value: 'two' }])
  })
  it('removes the given regex', function () {
    const result = removeExcludedFiles(
      [new AbsoluteFilePath('one'), new AbsoluteFilePath('two')],
      'on.'
    )
    expect(result).to.eql([{ value: 'two' }])
  })
  it('removes the given regexes', function () {
    const result = removeExcludedFiles(
      [
        new AbsoluteFilePath('one'),
        new AbsoluteFilePath('two'),
        new AbsoluteFilePath('three')
      ],
      ['on.', 'thr*']
    )
    expect(result).to.eql([{ value: 'two' }])
  })
  it('does not remove things if no excludes are given', function () {
    const result = removeExcludedFiles([new AbsoluteFilePath('one')], [])
    expect(result).to.eql([{ value: 'one' }])
  })
  it('automatically ignores node_modules', function () {
    const result = removeExcludedFiles(
      [
        new AbsoluteFilePath('one'),
        new AbsoluteFilePath('node_modules/zonk/broken.md')
      ],
      'one'
    )
    expect(result).to.eql([])
  })
})
