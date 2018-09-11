class RunConsoleCommandOutput {

  static instance(): RunConsoleCommandOutput {
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

  value(): string {
    return this.content
  }
}

const instance = new RunConsoleCommandOutput()

export default RunConsoleCommandOutput
