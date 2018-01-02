// @flow

const {defineSupportCode} = require('cucumber')
const delay = require('delay')
const endChildProcesses = require('end-child-processes')
const fs = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const util = require('util')

defineSupportCode(function ({After, Before, setDefaultTimeout}) {
  // need such a high timeout because test coverage takes time to start up
  setDefaultTimeout(30000)

  Before(function () {
    this.rootDir = path.join(process.cwd(), 'tmp')
    if (fs.existsSync(this.rootDir)) rimraf.sync(this.rootDir)
    fs.mkdirSync(this.rootDir)
  })

  After(async function (scenario) {
    await util.promisify(endChildProcesses)
    if (scenario.result.status === 'failed') {
      console.log('\ntest artifacts are located in', this.rootDir)
    } else {
      await delay(1)
      rimraf.sync(this.rootDir)
    }
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
