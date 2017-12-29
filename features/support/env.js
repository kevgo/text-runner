// @flow

const {defineSupportCode} = require('cucumber')
const endChildProcesses = require('end-child-processes')
const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')
const rimraf = require('rimraf')
require('shelljs/global')
const tmp = require('tmp')
const {wait} = require('wait')

defineSupportCode(function ({After, Before, setDefaultTimeout}) {
  setDefaultTimeout(5000)

  Before(function () {
    this.rootDir = tmp.dirSync({unsafeCleanup: true})
  })

  After(function (scenario, done: DoneFunction) {
    endChildProcesses(() => {
      if (scenario.result.status === 'failed') {
        console.log('\ntest artifacts are located in', this.rootDir.name)
        done()
      } else {
        wait(1, () => {
          try {
            this.rootDir.removeCallback()
          } catch (e) {
            console.log(e)
          } finally {
            done()
          }
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
