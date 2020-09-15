import { Activity } from "./activity-list/types/activity"

export type { ActionArgs } from "./actions/types/action-args"
export { Activity } from "./activity-list/types/activity"
export { Configuration } from "./configuration/configuration"
export { defaultConfiguration } from "./configuration/default-configuration"
export { AstNode } from "./parsers/standard-AST/ast-node"
export { AstNodeList } from "./parsers/standard-AST/ast-node-list"
export { actionName } from "./actions/helpers/action-name"
export { DebugCommand, DebugSubcommand } from "./commands/debug"
export { DynamicCommand } from "./commands/dynamic"
export { RunCommand } from "./commands/run"
export { StaticCommand } from "./commands/static"
export { UserError } from "./errors/user-error"
export { CommandEvent } from "./commands/command"
export { Publications } from "./configuration/publications/publications"

export interface StartArgs {
  stepCount: number
}

export interface SuccessArgs {
  activity: Activity
  finalName: string
  /** captured output (via action.log) while executing the activity */
  output: string
}

export interface FailedArgs {
  activity: Activity
  finalName: string
  error: Error
  /** captured output (via action.log) while executing the activity */
  output: string
}

export interface WarnArgs {
  activity?: Activity
  finalName?: string
  message: string
}

export interface SkippedArgs {
  activity: Activity
  finalName: string
  output: string
}
