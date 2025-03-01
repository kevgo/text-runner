import * as observableProcess from "observable-process"

/** CurrentServer provides global access to the currently running server process. */
export class CurrentServer {
  process: null | observableProcess.RunningProcess
  constructor() {
    this.process = null
  }

  static instance(): CurrentServer {
    return instance
  }

  hasProcess(): boolean {
    return this.process != null
  }

  async kill(): Promise<void> {
    await this.process?.kill()
  }

  reset(): void {
    this.process = null
  }

  set(process: observableProcess.RunningProcess): void {
    this.process = process
  }
}

const instance = new CurrentServer()
