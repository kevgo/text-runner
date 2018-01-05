// @flow

export interface Command {
  run(): Promise<?ErrnoError>
}
