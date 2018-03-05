// @flow

export interface Command {
  run(file: string): Promise<?ErrnoError>;
}
