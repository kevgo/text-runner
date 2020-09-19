import { assert } from "chai"
import { DetailedFormatter } from "./implementations/detailed-formatter"
import { DotFormatter } from "./implementations/dot-formatter"
import * as formatter from "."
import { SummaryFormatter } from "./implementations/summary-formatter"
import * as events from "events"
import { ProgressFormatter } from "./implementations/progress-formatter"

suite("instantiateFormatter()", function () {
  const emitter = new events.EventEmitter()
  test("request detailed formatter", function () {
    const have = formatter.instantiate("detailed", ".", emitter)
    assert.instanceOf(have, DetailedFormatter)
  })

  test("request dot formatter", function () {
    const have = formatter.instantiate("dot", ".", emitter)
    assert.instanceOf(have, DotFormatter)
  })

  test("request progress formatter", function () {
    const have = formatter.instantiate("progress", ".", emitter)
    assert.instanceOf(have, ProgressFormatter)
  })

  test("request summary formatter", function () {
    const have = formatter.instantiate("summary", ".", emitter)
    assert.instanceOf(have, SummaryFormatter)
  })

  test("request unknown formatter", function () {
    let err = null
    try {
      // @ts-ignore
      formatter.instantiate("zonk", ".", emitter)
    } catch (e) {
      err = e
    }
    assert.exists(err, "function did not throw")
    assert.equal(err.name, "UserError")
    assert.equal(err.message, "Unknown formatter: zonk")
    assert.equal(err.guidance, "Available formatters are: detailed, dot, progress, summary")
  })
})
