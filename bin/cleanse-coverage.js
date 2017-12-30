// @flow

// This script converts the coverage files created by the CLI coverage tests
// into a format that is compatible with the rest of the coverage files.

const path = require('path')

const data = require(path.join(process.cwd(), process.argv[2]))
const result = {}
const re = /\/dist\//
for (let key of Object.keys(data)) {
  if (re.test(key)) continue
  result[key] = data[key]
}
console.log(JSON.stringify(result))
