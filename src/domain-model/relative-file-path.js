// @flow

const path = require('path')

// RelativeFilePath represents a relative path
// to a file on the local file system.
class RelativeFilePath {
  constructor(value: string) {
    this.value = value
  }

  // Returns the absolute file path
  // resulting from adding this relative path to the given root directory
  absolutePath(root: string): absolutePath {
    return new AbsolutePath(path.join(root, this.value))
  }
}

module.exports = RelativeFilePath
