import { assert } from "chai"

import * as helpers from "."

suite("StopWatch", function () {
  test("less than 1s", function () {
    const stopWatch = new helpers.StopWatch()
    // @ts-ignore: access private member
    stopWatch.startTime -= 200
    assert.match(stopWatch.duration(), /20\dms/)
  })

  test("more than 1s", function () {
    const stopWatch = new helpers.StopWatch()
    // @ts-ignore: access private member
    stopWatch.startTime -= 2000
    assert.equal(stopWatch.duration(), "2s")
  })
})
