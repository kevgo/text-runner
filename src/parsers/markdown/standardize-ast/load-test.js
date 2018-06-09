// @flow

const loadTransformers = require('./load-transformers.js')
const { expect } = require('chai')

describe('loadTransformers', function () {
  it('loads MD files', async function () {
    const result = await loadTransformers()
    expect(Object.keys(result).length).to.be.above(0)
  })
})
