import { assert } from "chai"
import * as textRunner from "text-runner-core"

import { DetailedFormatter } from "./detailed-formatter.js"
import { DotFormatter } from "./dot-formatter.js"
import * as formatter from "./index.js"
import { ProgressFormatter } from "./progress-formatter.js"
import { SummaryFormatter } from "./summary-formatter.js"

suite("instantiateFormatter()", function () {
  const command = new textRunner.commands.Run({})
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

  test("request unknown formatter", function (done) {
    let err: textRunner.UserError
    try {
      // @ts-expect-error "zonk" is not allowed here
      formatter.instantiate("zonk", command)
      return done("did not explode")
    } catch (e) {
      if (!textRunner.isUserError(e)) {
        throw new Error("should be UserError")
      }
      err = e
    }
    assert.exists(err, "function did not throw")
    assert.equal(err.name, "UserError")
    assert.equal(err.message, "Unknown formatter: zonk")
    assert.equal(err.guidance, "Available formatters are: detailed, dot, progress, summary")
    done()
  })
})
