import glob from 'glob'
import path from 'path'

module.exports = function builtinActionFilenames(): string[] {
  return glob.sync(path.join(__dirname, '..', 'actions', '*.js'))
}
