import { assert } from "chai"
import { suite, test } from "node:test"

import * as run from "./index.js"

suite("StopWatch", function () {
  test("less than 1s", function () {
    const stopWatch = new run.StopWatch()
    // @ts-ignore: access private member
    stopWatch.startTime -= 200
    assert.match(stopWatch.duration(), /2\d\dms/)
  })

  test("more than 1s", function () {
    const stopWatch = new run.StopWatch()
    // @ts-ignore: access private member
    stopWatch.startTime -= 2000
    assert.equal(stopWatch.duration(), "2s")
  })
})
