// @flow

// Represents the configuration setting
class DefaultFile {
  constructor(value: string) {
    this.value = value
  }

  isSet(): boolean {
    return !!this.value
  }
}
