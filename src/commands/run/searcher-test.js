// @flow

import type {AstNodeList} from '../../typedefs/ast-node-list.js'

const Searcher = require('./searcher.js')
const {expect} = require('chai')

describe('Searcher', function () {
  before(function () {
    const nodes: AstNodeList = [
      {type: 'image', content: 'one'},
      {type: 'link', content: 'two'},
      {type: 'link', content: 'three'}
    ]
    this.searcher = new Searcher(nodes)
  })

  context('string query', function () {
    before(function () {
      this.result = this.searcher('link')
    })

    it('returns the content of the first matching node', function () {
      expect(this.result).to.equal('two')
    })
  })

  context('array query', function () {
    before(function () {
      this.result = this.searcher(['link', 'image'])
    })

    it('returns the content of the first matching node', function () {
      expect(this.result).to.equal('one')
    })
  })
})
