import { assert } from "chai"
import * as tr from "text-runner-core"

import * as formatter from "."
import { DetailedFormatter } from "./detailed-formatter"
import { DotFormatter } from "./dot-formatter"
import { ProgressFormatter } from "./progress-formatter"
import { SummaryFormatter } from "./summary-formatter"

suite("instantiateFormatter()", function () {
  const command = new tr.commands.Run({})
  test("request detailed formatter", function () {
    const have = formatter.instantiate("detailed", command)
    assert.instanceOf(have, DetailedFormatter)
  })

  test("request dot formatter", function () {
    const have = formatter.instantiate("dot", command)
    assert.instanceOf(have, DotFormatter)
  })

  test("request progress formatter", function () {
    const have = formatter.instantiate("progress", command)
    assert.instanceOf(have, ProgressFormatter)
  })

  test("request summary formatter", function () {
    const have = formatter.instantiate("summary", command)
    assert.instanceOf(have, SummaryFormatter)
  })

  test("request unknown formatter", function () {
    let err
    try {
      // @ts-ignore
      formatter.instantiate("zonk", ".", command)
    } catch (e) {
      err = e
    }
    assert.exists(err, "function did not throw")
    assert.equal(err.name, "UserError")
    assert.equal(err.message, "Unknown formatter: zonk")
    assert.equal(err.guidance, "Available formatters are: detailed, dot, progress, summary")
  })
})
