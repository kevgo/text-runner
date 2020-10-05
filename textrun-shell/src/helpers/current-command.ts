import * as observableProcess from "observable-process"

/** CurrentCommand provides global access to the currently running console command. */
export class CurrentCommand {
  static instance(): observableProcess.FinishedProcess {
    if (!instance) {
      throw new Error("no instance")
    }
    return instance
  }

  static set(process: observableProcess.FinishedProcess): void {
    instance = process
  }
}

let instance: observableProcess.FinishedProcess | null = null
