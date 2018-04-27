// @flow

const parseMarkdown = require('./parse-markdown.js')
const { expect } = require('chai')
const fs = require('fs')
const path = require('path')

describe('parseMarkdown', function () {
  const testCases = fs.readdirSync(path.join(__dirname, 'tests'))
  for (let testCase of testCases) {
    it(testCase, function () {
      const testCaseDir = path.join(__dirname, 'tests', testCase)
      const input = fs.readFileSync(path.join(testCaseDir, 'input.md'))
      const result = require(path.join(testCaseDir, 'result.json'))
      expect(parseMarkdown(input.toString().trim(), 'input.md')).to.eql(result)
    })
  }
})
