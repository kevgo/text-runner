import { expect } from 'chai'
import actionName from './action-name'

describe('actionName', function() {
  it('returns the name of the action corresponding to the given filename', function() {
    const result = actionName('/d/text-runner/text-run/cdBack.js')
    expect(result).to.equal('cd-back')
  })
})
