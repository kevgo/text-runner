// @flow

const { expect } = require('chai')
const fs = require('fs')
const loadConfiguration = require('./load-configuration.js')
const path = require('path')
const tmp = require('tmp')

describe('loadConfiguration', function () {
  it('returns default values if no config file is given', function () {
    const result = loadConfiguration('', { command: '' })
    expect(result.fileGlob).to.equal('**/*.md')
  })

  context('config file given', function () {
    beforeEach(function () {
      this.configDir = tmp.dirSync()
      this.configFilePath = path.join(this.configDir.name, 'text-run.yml')
      fs.writeFileSync(this.configFilePath, "files: '*.md'")
      const result = loadConfiguration('', { command: '' })
      expect(result.fileGlob).to.equal('*.md')
    })
  })
})
