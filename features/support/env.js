// @flow

const endChildProcesses = require('end-child-processes')
const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')
const rimraf = require('rimraf')
require('shelljs/global')
const tmp = require('tmp')
const {wait} = require('wait')

module.exports = function () {
  this.setDefaultTimeout(5000)

  this.Before(function () {
    this.rootDir = tmp.dirSync({unsafeCleanup: true})
  })

  this.After(function (scenario, done: DoneFunction) {
    endChildProcesses(() => {
      if (scenario.isFailed()) {
        console.log('\n\n', 'Failing scenario:', scenario.getName())
        console.log('\n', scenario.getException())
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

  this.Before({tags: ['@verbose']}, function () {
    this.verbose = true
  })

  this.After({tags: ['@verbose']}, function () {
    this.verbose = false
  })

  this.Before({tags: ['@debug']}, function () {
    this.debug = true
    this.verbose = true
  })

  this.After({tags: ['@debug']}, function () {
    this.debug = false
    this.verbose = false
  })
}
