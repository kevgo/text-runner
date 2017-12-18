const camelcase = require('camelcase')
const Configuration = require('../configuration')
const {red} = require('chalk')
const FormatterManager = require('../formatters/formatter-manager')
const glob = require('glob')
const interpret = require('interpret')
const path = require('path')
const rechoir = require('rechoir')

// Loads and provides built-in and custom actions
class ActionManager {
  constructor (formatter: FormatterManager, configuration: Configuration) {
    this.formatter = formatter
    this.configuration = configuration
    this.actions = {}
    this.loadBuiltinActions()
    this.loadCustomActions()
  }

  // Provides the action for the block with the given name
  actionFor (blockName) {
    const result = this.actions[blockName.toLowerCase()]
    if (!result) {
      var errorText = `unknown action: ${red(blockName)}\nAvailable actions:\n`
      const prefix = this.configuration.get('classPrefix')
      for (let actionName of Object.keys(this.actions).sort()) {
        errorText += `* ${prefix}${actionName}\n`
      }
      this.formatter.error(errorText)
      throw new Error(errorText)
    }
    return result
  }

  // Returns all possible filename extensions that actions can have
  javascriptExtensions () {
    return Object.keys(interpret.jsVariants).map((it) => it.slice(1))
  }

  builtinActionFilenames () {
    return glob.sync(path.join(__dirname, 'built-in', '*.js'))
  }

  customActionFilenames () {
    const pattern = path.join(process.cwd(), 'text-run', `*.@(${this.javascriptExtensions().join('|')})`)
    return glob.sync(pattern)
  }

  loadBuiltinActions () {
    for (let filename of this.builtinActionFilenames()) {
      const actionName = camelcase(path.basename(filename, path.extname(filename))).replace(/Action/, '')
                                                                                   .toLowerCase()
      this.actions[actionName] = require(filename)
    }
  }

  loadCustomActions () {
    for (let filename of this.customActionFilenames()) {
      rechoir.prepare(interpret.jsVariants, filename)
      const actionName = camelcase(path.basename(filename, path.extname(filename))).replace(/Action/, '')
                                                                                   .toLowerCase()
      this.actions[actionName] = require(filename)
    }
  }
}

module.exports = ActionManager
