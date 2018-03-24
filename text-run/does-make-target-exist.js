const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = async function ({ formatter, searcher }) {
  const makeExpression = searcher.tagContent('code')
  const target = makeExpression.split(' ')[1]
  const { stdout, stderr } = await exec('make help')
  if (stderr.length > 0) {
    throw new Error(`Error running 'make help': ${stderr}`)
  }
  if (!stdout.includes(target)) {
    throw new Error(`binary '${target}' does not exist`)
  }
}
