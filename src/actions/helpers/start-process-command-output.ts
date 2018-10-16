class StartProcessCommandOutput {
  static instance(): StartProcessCommandOutput {
    return instance
  }
  content: string

  constructor() {
    this.content = ""
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
