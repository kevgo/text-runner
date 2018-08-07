// @flow

// Represents a link to another Markdown file,
// all the way from the root directory
// (i.e. a link starting with '/')
class AbsoluteLink {
  constructor(value: string) {
    this.value = value.replace(/\/+/g, '/')
  }

  withExtension(newExtension: string): AbsoluteLink {
    const extRE = new RegExp(path.extname(this.value) + '$')
    return new AbsoluteLink(this.value.replace(extRE, newExtension)
  }
}
