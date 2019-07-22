import { expect } from "chai"
import delay from "delay"
import { StopWatch } from "./stopwatch"

describe("StopWatch", function() {
  it("returns the elapsed time", async function() {
    const stopWatch = new StopWatch()
    await delay(10)
    expect(stopWatch.duration()).to.match(/\d+ ms/)
  })
})
