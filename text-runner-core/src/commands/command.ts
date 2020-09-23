import * as events from "../events/index"

/** Command describes a Text-Runner command */
// TODO: remove EventEmitter here
export interface Command extends NodeJS.EventEmitter {
  /** executes this command */
  execute(): void
  on(event: events.CommandEvent, handler: (arg: any) => void): this
  // TODO: replace boolean with void
  emit(event: events.CommandEvent, payload: events.Args): boolean
}
