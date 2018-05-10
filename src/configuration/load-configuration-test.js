const fs = require('fs')
const loadConfiguration = require('./load-configuration.js')
const path = require('path')
const tmp = require('tmp')

describe('loadConfiguration', function () {
  it('returns default values if no config file is given', function () {
    const result = loadConfiguration('', {})
    expect(result.files).to.equal('**/*.md')
  })

  context('config file given', function () {
    beforeEach(function () {
      this.configDir = tmp.dirSync()
      this.configFilePath = path.join(this.configDir.name, 'text-run.yml')
      fs.writeFileSync(this.configFilePath, "files: '*.md'")
      const result = loadConfiguration('', {})
    })

    describe('files attribute', function () {
      it('returns the value from the file', function () {
        expect(this.config.get('files')).to.equal('*.md')
      })
    })
  })
})
