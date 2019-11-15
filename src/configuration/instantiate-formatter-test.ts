import { assert } from "chai"
import { DetailedFormatter } from "../formatters/detailed-formatter"
import { DotFormatter } from "../formatters/dot-formatter"
import { instantiateFormatter } from "./instantiate-formatter"
import { scaffoldConfiguration } from "./types/configuration"

const config = scaffoldConfiguration()

suite("instantiateFormatter", function() {
  test("dot formatter", function() {
    const actual = instantiateFormatter("dot", 0, config)
    assert.instanceOf(actual, DotFormatter)
  })

  test("detailed formatter", function() {
    const actual = instantiateFormatter("detailed", 0, config)
    assert.instanceOf(actual, DetailedFormatter)
  })

  test("unknown formatter name", function() {
    assert.throws(function() {
      instantiateFormatter("zonk", 0, config)
    }, "Unknown formatter: zonk\n\nAvailable formatters are: detailed, dot, progress")
  })
})
