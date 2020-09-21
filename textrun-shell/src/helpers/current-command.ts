import { ObservableProcess } from "observable-process"

/** CurrentCommand provides global access to the currently running console command. */
export class CurrentCommand {
  static instance(): ObservableProcess {
    if (!instance) {
      throw new Error("no instance")
    }
    return instance
  }

  static set(process: ObservableProcess): void {
    instance = process
  }
}

let instance: ObservableProcess | null = null
