import builtinActionFilenames from './builtin-action-filepaths.js'
import { expect } from 'chai'
import { describe, it } from 'mocha'

describe('builtinActionFilenames', function() {
  it('returns the built-in action file paths', function() {
    const result = builtinActionFilenames()
    expect(result[0]).to.match(/\/src\/actions\/cd.js/)
  })
})
