import { expect } from "chai"
import builtinActionFilenames from "../../dist/helpers/builtin-action-filepaths"

describe("builtinActionFilenames", function() {
  it("returns the built-in action file paths", function() {
    const result = builtinActionFilenames()
    expect(result[0]).to.match(/\/dist\/actions\/cd/)
  })
})
