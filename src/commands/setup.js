// @flow

const { cyan, green } = require('chalk')
const createConfiguration = require('../configuration/create-configuration.js')

module.exports = async function () {
  createConfiguration()
  console.log(
    green(
      `Created configuration file ${cyan('text-run.yml')} with default values`
    )
  )
}
