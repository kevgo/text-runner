import { assert } from "chai"
import { DetailedFormatter } from "./implementations/detailed-formatter"
import { DotFormatter } from "./implementations/dot-formatter"
import { instantiateFormatter } from "./instantiate"
import { SummaryFormatter } from "./implementations/summary-formatter"
import { EventEmitter } from "events"
import { ProgressFormatter } from "./implementations/progress-formatter"
import { defaultConfiguration } from "text-runner-core"

suite("instantiateFormatter()", function () {
  const emitter = new EventEmitter()
  test("request detailed formatter", function () {
    const config = defaultConfiguration()
    config.formatterName = "detailed"
    const formatter = instantiateFormatter(config, emitter)
    assert.instanceOf(formatter, DetailedFormatter)
  })

  test("request dot formatter", function () {
    const config = defaultConfiguration()
    config.formatterName = "dot"
    const formatter = instantiateFormatter(config, emitter)
    assert.instanceOf(formatter, DotFormatter)
  })

  test("request progress formatter", function () {
    const config = defaultConfiguration()
    config.formatterName = "progress"
    const formatter = instantiateFormatter(config, emitter)
    assert.instanceOf(formatter, ProgressFormatter)
  })

  test("request summary formatter", function () {
    const config = defaultConfiguration()
    config.formatterName = "summary"
    const formatter = instantiateFormatter(config, emitter)
    assert.instanceOf(formatter, SummaryFormatter)
  })

  test("request unknown formatter", function () {
    const config = defaultConfiguration()
    // @ts-ignore
    config.formatterName = "zonk"
    let err = null
    try {
      instantiateFormatter(config, emitter)
    } catch (e) {
      err = e
    }
    assert.exists(err, "function did not throw")
    assert.equal(err.name, "UserError")
    assert.equal(err.message, "Unknown formatter: zonk")
    assert.equal(err.guidance, "Available formatters are: detailed, dot, progress, summary")
  })
})
