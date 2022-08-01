import * as actions from "./index"

/** continuous-passing-style callback function */
export type DoneFunction = (err?: Error) => void

export type SyncAction = (action: actions.Args) => void
export type CbAction = (action: actions.Args, done: DoneFunction) => void
export type PromiseAction = (action: actions.Args) => Promise<void>
export type Action = SyncAction | CbAction | PromiseAction

/** data format of exported actions by npm modules */
export type TextrunActions = Record<string, Action>
