import { expect } from 'chai'
import delay from 'delay'
import StatsCounter from './stats-counter'

describe('StatsCounter', function() {
  it('counts the number of errors', function() {
    const counter = new StatsCounter()
    counter.error()
    counter.error()
    expect(counter.errors()).to.equal(2)
  })
  it('counts the number of skips', function() {
    const counter = new StatsCounter()
    counter.skip()
    counter.skip()
    expect(counter.skips()).to.equal(2)
  })
  it('counts the number of successes', function() {
    const counter = new StatsCounter()
    counter.success()
    counter.success()
    expect(counter.successes()).to.equal(2)
  })
  it('counts the number of warnings', function() {
    const counter = new StatsCounter()
    counter.warning()
    counter.warning()
    expect(counter.warnings()).to.equal(2)
  })
  it('counts the time', async function() {
    const counter = new StatsCounter()
    await delay(1)
    expect(counter.duration()).to.match(/\d+.s/)
  })
})
