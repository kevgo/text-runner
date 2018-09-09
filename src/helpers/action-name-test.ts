import actionName from './action-name.js'
import { expect } from 'chai'

describe('actionName', function() {
  it('returns the name of the action corresponding to the given filename', function() {
    const result = actionName('/d/text-runner/text-run/cdBack.js')
    expect(result).to.equal('cd-back')
  })
})
