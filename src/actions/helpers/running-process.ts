import ObservableProcess from "observable-process"

export default class RunningProcess {
  process: ObservableProcess | null

  constructor() {
    this.process = null
  }

  static instance(): RunningProcess {
    return instance
  }

  hasProcess(): boolean {
    return this.process != null
  }
  kill() {
    this.process.kill()
  }

  reset() {
    this.process = null
  }

  set(process: ObservableProcess) {
    this.process = process
  }
}

const instance = new RunningProcess()
