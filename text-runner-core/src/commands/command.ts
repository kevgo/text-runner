import * as events from "../events/index"

/** Command describes a Text-Runner command */
export interface Command {
  /** executes this command */
  execute(): Promise<void>
  on(event: events.Name, handler: events.Handler): void
  emit(event: events.Name, payload: events.Args): void
}
