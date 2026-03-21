import type * as observableProcess from "observable-process"

/** CurrentCommand provides global access to the currently running console command. */
export function instance(): observableProcess.FinishedProcess {
  if (!_instance) {
    throw new Error("no instance")
  }
  return _instance
}

export function set(process: observableProcess.FinishedProcess): void {
  _instance = process
}

let _instance: null | observableProcess.FinishedProcess = null
