// @flow

const loadHtmlBlockTransformers = require('./load-htmlblock-transformers.js')
const { expect } = require('chai')

describe('loadTransformers', function () {
  it('loads MD files', async function () {
    const result = await loadHtmlBlockTransformers()
    expect(Object.keys(result).length).to.be.above(0)
  })
})
