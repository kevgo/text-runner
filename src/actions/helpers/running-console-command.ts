import ObservableProcess from "observable-process"

// Provides global access to the currently running console command
class RunningConsoleCommand {
  // Returns the currently running console command
  static instance(): ObservableProcess {
    return instance
  }

  static set(process: ObservableProcess) {
    instance = process
  }
}

let instance = null

export default RunningConsoleCommand
