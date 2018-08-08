// @flow

// Represents the configuration setting
class DefaultFile {
  value: string

  constructor (value: string) {
    this.value = value
  }

  isSet (): boolean {
    return !!this.value
  }
}

module.exports = DefaultFile
