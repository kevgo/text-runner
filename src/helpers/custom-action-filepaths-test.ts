import { expect } from "chai"
import { describe, it } from "mocha"
import customActionFilePaths from "./custom-action-filepaths.js"

describe("customActionFilePaths", function() {
  it("returns the full paths to the custom actions", function() {
    const result = customActionFilePaths()
    expect(result[0]).to.match(/\/text-run\/cd-back.js/)
  })
})
