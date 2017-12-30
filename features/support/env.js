// @flow

const {defineSupportCode} = require('cucumber')
const endChildProcesses = require('end-child-processes')
const fs = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const {wait} = require('wait')

defineSupportCode(function ({After, Before, setDefaultTimeout}) {
  // need such a high timeout because test coverage takes time to start up
  setDefaultTimeout(30000)

  Before(function () {
    this.rootDir = path.join(process.cwd(), 'tmp')
    if (fs.existsSync(this.rootDir)) rimraf.sync(this.rootDir)
    fs.mkdirSync(this.rootDir)
  })

  After(function (scenario, done: DoneFunction) {
    endChildProcesses(() => {
      if (scenario.result.status === 'failed') {
        console.log('\ntest artifacts are located in', this.rootDir)
        done()
      } else {
        wait(1, () => {
          rimraf(this.rootDir, {}, done)
        })
      }
    })
  })

  Before({tags: '@verbose'}, function () {
    this.verbose = true
  })

  After({tags: '@verbose'}, function () {
    this.verbose = false
  })

  Before({tags: '@debug'}, function () {
    this.debug = true
    this.verbose = true
  })

  After({tags: '@debug'}, function () {
    this.debug = false
    this.verbose = false
  })
})
