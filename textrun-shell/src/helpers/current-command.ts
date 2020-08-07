import { ObservableProcess } from "observable-process"

/** provides global access to the currently running console command. */
export class CurrentCommand {
  static instance(): ObservableProcess {
    if (!instance) {
      throw new Error("no instance")
    }
    return instance
  }

  static set(process: ObservableProcess) {
    instance = process
  }
}

let instance: ObservableProcess | null = null
