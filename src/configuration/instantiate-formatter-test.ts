import { strict as assert } from "assert"
import { expect } from "chai"
import { DetailedFormatter } from "../formatters/detailed-formatter"
import { DotFormatter } from "../formatters/dot-formatter"
import { instantiateFormatter } from "./instantiate-formatter"
import { scaffoldConfiguration } from "./types/configuration"

const config = scaffoldConfiguration()

describe("instantiateFormatter", function() {
  it("returns the dot formatter if requested", function() {
    const actual = instantiateFormatter("dot", 0, config)
    expect(actual).to.be.an.instanceOf(DotFormatter)
  })

  it("returns the detailed formatter if requested", function() {
    const actual = instantiateFormatter("detailed", 0, config)
    expect(actual).to.be.an.instanceOf(DetailedFormatter)
  })

  it("throws if an unknown name is given", function() {
    assert.throws(function() {
      instantiateFormatter("zonk", 0, config)
    }, new Error(
      "Unknown formatter: zonk\n\nAvailable formatters are: detailed, dot, progress"
    ))
  })
})
