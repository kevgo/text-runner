import { ObservableProcess } from 'observable-process'

export default class RunningProcess {
  static instance(): RunningProcess {
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
    this.process && this.process.kill()
  }

  reset() {
    this.process = null
  }

  set(process: ObservableProcess) {
    this.process = process
  }
}

const instance = new RunningProcess()
