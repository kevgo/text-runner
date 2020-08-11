import { assert } from "chai"
import { DetailedFormatter } from "../formatters/detailed-formatter"
import { DotFormatter } from "../formatters/dot-formatter"
import { instantiateFormatter } from "./instantiate-formatter"
import { scaffoldConfiguration } from "./types/configuration"

const config = scaffoldConfiguration()

suite("instantiateFormatter()", function () {
  test("request dot formatter", function () {
    const formatter = instantiateFormatter("dot", 0, config)
    assert.instanceOf(formatter, DotFormatter)
  })

  test("request detailed formatter", function () {
    const formatter = instantiateFormatter("detailed", 0, config)
    assert.instanceOf(formatter, DetailedFormatter)
  })

  test("request unknown formatter", function () {
    assert.throws(function () {
      instantiateFormatter("zonk", 0, config)
    }, "Unknown formatter: zonk\n\nAvailable formatters are: detailed, dot, progress")
  })
})
