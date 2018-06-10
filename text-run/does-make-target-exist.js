// @flow

import type { ActionArgs } from '../src/runners/action-args.js'

const util = require('util')
const exec = util.promisify(require('child_process').exec)
const path = require('path')

module.exports = async function (args: ActionArgs) {
  const makeExpression = args.nodes.text()
  const expected = makeExpression.replace(/make\s+/, '')
  const makePath = path.join(args.configuration.sourceDir, 'Makefile')
  const { stdout, stderr } = await exec(
    `cat ${makePath} | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#//'`
  )
  if (stderr.length > 0) {
    throw new Error(`Error running 'make help': ${stderr}`)
  }
  const actuals = stdout.split('\n').map(actual => actual.split(' ')[0])
  if (!actuals.includes(expected)) {
    throw new Error(`make script '${expected}' does not exist`)
  }
}
