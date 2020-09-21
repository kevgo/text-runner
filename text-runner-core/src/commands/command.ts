/** Command describes a Text-Runner command */
export interface Command extends NodeJS.EventEmitter {
  /** executes this command */
  execute(): void
  on(event: CommandEvent, handler: (arg: any) => void): this
}

/** CommandEvent defines the events that a command can emit. */
export enum CommandEvent {
  start = "start", // execution is starting
  output = "output", // something to print to the user
  success = "success", // a step was successful
  failed = "failed", // a step failed
  skipped = "skipped", // a step was skipped
  warning = "warning", // a warning to print to the user
  finish = "finish", // execution is done
}
