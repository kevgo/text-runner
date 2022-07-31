import * as actions from "./index"

export type TextrunActions = Record<string, (action: actions.Args) => void | Promise<void>>
