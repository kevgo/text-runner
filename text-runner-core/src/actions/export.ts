import * as actions from "./index"

/** expected file structure of "package.json" files */
export interface PackageJson {
  main: string
}

/** expected file structure of "index.js" files exporting Text-Runner actions */
export interface IndexFile {
  textrunActions: TextrunActions
}

/** continuous-passing-style callback function */
export type DoneFunction = (err?: Error) => void

export type SyncAction = (action: actions.Args) => void
export type CbAction = (action: actions.Args, done: DoneFunction) => void
export type PromiseAction = (action: actions.Args) => Promise<void>
export type Action = SyncAction | CbAction | PromiseAction

/** data format of exported actions by npm modules */
export type TextrunActions = Record<string, Action>
