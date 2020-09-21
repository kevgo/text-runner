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

  kill(): void {
    this.process?.kill()
  }

  reset(): void {
    this.process = null
  }

  set(process: ObservableProcess): void {
    this.process = process
  }
}

const instance = new CurrentServer()
