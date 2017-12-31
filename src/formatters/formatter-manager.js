// @flow

const glob = require('glob')
const path = require('path')

class FormatterManager {
  // Returns a list of all available formatter names
  availableFormatterNames (): string[] {
    return glob.sync(path.join(__dirname, '*-formatter.js')).map((filename) => path.basename(filename, '.js'))
                                                            .map((it) => it.replace(/-formatter/, ''))
  }

  getFormatter (name: string | Formatter): Formatter {
    if (typeof name === 'string') {
      return this.loadFormatter(name)
    } else {
      return name
    }
  }

  // Loads the formatter with the given name.
  // Returns the formatter and an optional error.
  loadFormatter (name: string): Formatter {
    try {
      const FormatterClass = require(`./${name}-formatter`)
      return new FormatterClass()
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        throw new Error(`Unknown formatter: '${name}'\n\nAvailable formatters are ${this.availableFormatterNames().join(', ')}`)
      } else {
        throw e
      }
    }
  }
}

module.exports = FormatterManager