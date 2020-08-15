import { assert } from "chai"
import { DetailedFormatter } from "../formatters/detailed-formatter"
import { DotFormatter } from "../formatters/dot-formatter"
import { instantiateFormatter } from "./instantiate-formatter"
import { scaffoldConfiguration } from "./types/configuration"
import { SummaryFormatter } from "../formatters/summary-formatter"

const config = scaffoldConfiguration()

suite("instantiateFormatter()", function () {
  test("request detailed formatter", function () {
    const formatter = instantiateFormatter("detailed", 0, config)
    assert.instanceOf(formatter, DetailedFormatter)
  })

  test("request dot formatter", function () {
    const formatter = instantiateFormatter("dot", 0, config)
    assert.instanceOf(formatter, DotFormatter)
  })

  // NOTE: this creates an instance of the formatter right away.
  //       refactor the formatter interface to have a "start" method where the progressbar is instantiated.
  // test("request progress formatter", function () {
  //   const formatter = instantiateFormatter("progress", 0, config)
  //   assert.instanceOf(formatter, ProgressFormatter)
  // })

  test("request summary formatter", function () {
    const formatter = instantiateFormatter("summary", 0, config)
    assert.instanceOf(formatter, SummaryFormatter)
  })

  test("request unknown formatter", function () {
    assert.throws(function () {
      instantiateFormatter("zonk", 0, config)
    }, "Unknown formatter: zonk\n\nAvailable formatters are: detailed, dot, progress")
  })
})
