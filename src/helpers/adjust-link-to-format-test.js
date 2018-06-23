// @flow

const adjustLinkToFormat = require('./adjust-link-to-format.js')
const { expect } = require('chai')

describe('adjustLinkToFormat', function () {
  context('with direct option', function () {
    it('keeps links as they are', function () {
      const actual = adjustLinkToFormat('1.md', 'direct')
      expect(actual).to.eql('1.md')
    })
  })
  context('with html option', function () {
    it('changes links to .html to .md', function () {
      const actual = adjustLinkToFormat('1.html', 'html')
      expect(actual).to.eql('1.md')
    })
  })
  context('with urlFriendly option', function () {
    it('changes links without extension to .md', function () {
      const actual = adjustLinkToFormat('1', 'url-friendly')
      expect(actual).to.eql('1.md')
    })
  })
  context('unknown option', function () {
    it('throws', function () {
      const test = adjustLinkToFormat.bind(this, '1', 'zonk')
      expect(test).to.throw()
    })
  })
})
