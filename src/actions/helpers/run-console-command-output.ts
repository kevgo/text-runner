class RunConsoleCommandOutput {
  content: string

  constructor() {
    this.content = ""
  }

  static instance(): RunConsoleCommandOutput {
    return instance
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

let instance = new RunConsoleCommandOutput()

export default RunConsoleCommandOutput
