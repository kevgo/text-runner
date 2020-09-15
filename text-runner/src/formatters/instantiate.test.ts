import { assert } from "chai"
import { DetailedFormatter } from "./implementations/detailed-formatter"
import { DotFormatter } from "./implementations/dot-formatter"
import { instantiateFormatter } from "./instantiate"
import { defaultConfiguration } from "../configuration/default-configuration"
import { SummaryFormatter } from "./implementations/summary-formatter"

const config = defaultConfiguration()

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
    let err = null
    try {
      instantiateFormatter("zonk", 0, config)
    } catch (e) {
      err = e
    }
    assert.exists(err, "function did not throw")
    assert.equal(err.name, "UserError")
    assert.equal(err.message, "Unknown formatter: zonk")
    assert.equal(err.guidance, "Available formatters are: detailed, dot, progress, silent, summary")
  })
})
