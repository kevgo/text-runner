// @flow

const {expect} = require('chai')
const unixifyPath = require('./unixify-path.js')
describe('unixifyPath', function () {
  it('converts all backslashes to forward slashes', function () {
    expect(unixifyPath('\\foo/bar\\baz')).to.equal('/foo/bar/baz')
  })
  it('leaves forward slashes alone', function () {
    expect(unixifyPath('/foo/bar')).to.equal('/foo/bar')
  })
})
