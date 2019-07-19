import { expect } from 'chai'
import fs from 'fs-extra'
import path from 'path'
import tmp from 'tmp-promise'
import { loadConfiguration } from './load-configuration'

describe('loadConfiguration', function() {
  it('returns default values if no config file is given', async function() {
    const result = await loadConfiguration('', { command: '' })
    expect(result.fileGlob).to.equal('**/*.md')
  })

  context('config file given', function() {
    beforeEach(async function() {
      this.configDir = await tmp.dir()
      this.configFilePath = path.join(this.configDir.name, 'text-run.yml')
      await fs.writeFile(this.configFilePath, "files: '*.md'")
      const result = await loadConfiguration('', { command: '' })
      expect(result.fileGlob).to.equal('*.md')
    })
  })
})
