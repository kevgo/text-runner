class StartProcessCommandOutput {
  content: string

  constructor() {
    this.content = ""
  }

  static instance(): StartProcessCommandOutput {
    return instance
  }

  append(text: string) {
    this.content += text
  }

  reset() {
    this.content = ""
  }
}

const instance = new StartProcessCommandOutput()

export default StartProcessCommandOutput
