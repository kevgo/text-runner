import { assert } from "chai"
import { DetailedFormatter } from "./implementations/detailed-formatter"
import { DotFormatter } from "./implementations/dot-formatter"
import { instantiateFormatter } from "./instantiate"
import { SummaryFormatter } from "./implementations/summary-formatter"
import * as events from "events"
import { ProgressFormatter } from "./implementations/progress-formatter"
import * as tr from "text-runner-core"

suite("instantiateFormatter()", function () {
  const emitter = new events.EventEmitter()
  test("request detailed formatter", function () {
    const formatter = instantiateFormatter("detailed", ".", emitter)
    assert.instanceOf(formatter, DetailedFormatter)
  })

  test("request dot formatter", function () {
    const formatter = instantiateFormatter("dot", ".", emitter)
    assert.instanceOf(formatter, DotFormatter)
  })

  test("request progress formatter", function () {
    const formatter = instantiateFormatter("progress", ".", emitter)
    assert.instanceOf(formatter, ProgressFormatter)
  })

  test("request summary formatter", function () {
    const formatter = instantiateFormatter("summary", ".", emitter)
    assert.instanceOf(formatter, SummaryFormatter)
  })

  test("request unknown formatter", function () {
    let err = null
    try {
      instantiateFormatter("zonk", ".", emitter)
    } catch (e) {
      err = e
    }
    assert.exists(err, "function did not throw")
    assert.equal(err.name, "UserError")
    assert.equal(err.message, "Unknown formatter: zonk")
    assert.equal(err.guidance, "Available formatters are: detailed, dot, progress, summary")
  })
})
