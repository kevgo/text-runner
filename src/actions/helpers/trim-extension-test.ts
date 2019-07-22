import { expect } from "chai"
import { unixify } from "../../domain-model/helpers/unixify"
import { trimExtension } from "./trim-extension"

describe("trimExtension", function() {
  it("removes the extension from TypeScript paths", function() {
    const actual = trimExtension("/one/two/three.ts")
    expect(unixify(actual)).to.equal("/one/two/three")
  })
})
