import * as events from "../events/index"

/** Command describes a Text-Runner command */
export interface Command extends NodeJS.EventEmitter {
  /** executes this command */
  execute(): void
  on(event: events.CommandEvent, handler: (arg: any) => void): this
}
