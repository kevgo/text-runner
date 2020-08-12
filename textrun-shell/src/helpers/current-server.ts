import { ObservableProcess } from "observable-process"

/** CurrentServer provides global access to the currently running server process. */
export class CurrentServer {
  static instance(): CurrentServer {
    return instance
  }
  process: ObservableProcess | null

  constructor() {
    this.process = null
  }

  hasProcess(): boolean {
    return this.process != null
  }

  kill() {
    this.process?.kill()
  }

  reset() {
    this.process = null
  }

  set(process: ObservableProcess) {
    this.process = process
  }
}

const instance = new CurrentServer()
