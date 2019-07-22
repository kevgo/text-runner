import { expect } from "chai"
import delay from "delay"
import { StopWatch } from "./stopwatch"

describe("StopWatch", function() {
  it("returns the elapsed time in milliseconds if it is less than 1s", async function() {
    const stopWatch = new StopWatch()
    // @ts-ignore: access private member
    stopWatch.startTime -= 200
    expect(stopWatch.duration()).to.equal("200ms")
  })

  it("returns the elapsed time in seconds if it is more than 1s", async function() {
    const stopWatch = new StopWatch()
    // @ts-ignore: access private member
    stopWatch.startTime -= 2000
    await delay(10)
    expect(stopWatch.duration()).to.equal("2s")
  })
})
