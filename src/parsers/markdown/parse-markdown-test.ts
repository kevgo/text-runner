import { expect } from 'chai'
import fs from 'fs'
import path from 'path'
import AbsoluteFilePath from '../../domain-model/absolute-file-path'
import parseMarkdown from './parse-markdown'

describe('parseMarkdown', function() {
  const testCases = fs.readdirSync(path.join(__dirname, 'tests'))
  for (const testCase of testCases) {
    const testCaseDir = path.join(__dirname, 'tests', testCase)
    const inputs = fs
      .readdirSync(testCaseDir)
      .filter(file => file.endsWith('.md'))
    for (const inputFile of inputs) {
      let name = testCase
      if (inputFile !== 'input.md') {
        name += `-${path.basename(inputFile, '.md')}`
      }
      it(name, async function() {
        const input = fs.readFileSync(path.join(testCaseDir, inputFile))
        const expected = require(path.join(testCaseDir, 'result.json'))
        const actual = await parseMarkdown(
          input.toString().trim(),
          new AbsoluteFilePath('input.md')
        )
        expect(actual).to.eql(expected)
      })
    }
  }
})
