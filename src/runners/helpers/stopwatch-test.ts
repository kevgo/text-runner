import { assert } from "chai"
import { StopWatch } from "./stopwatch"

suite("StopWatch", function() {
  test("less than 1s", function() {
    const stopWatch = new StopWatch()
    // @ts-ignore: access private member
    stopWatch.startTime -= 200
    assert.equal(stopWatch.duration(), "200ms")
  })

  test("more than 1s", function() {
    const stopWatch = new StopWatch()
    // @ts-ignore: access private member
    stopWatch.startTime -= 2000
    assert.equal(stopWatch.duration(), "2s")
  })
})
