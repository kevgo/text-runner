import * as actions from "./index.js"

export type Action = CbAction | PromiseAction | SyncAction

export type CbAction = (action: actions.Args, done: DoneFunction) => void

/** continuous-passing-style callback function */
export type DoneFunction = (err?: Error) => void

/** expected file structure of "index.js" files exporting Text-Runner actions */
export interface IndexFile {
  textrunActions: TextrunActions
}
/** elements of "package.json" files used here */
export interface PackageJson {
  exports: string
}
export type PromiseAction = (action: actions.Args) => Promise<void>
export type SyncAction = (action: actions.Args) => void

/** data format of exported actions by npm modules */
export type TextrunActions = Record<string, Action>
