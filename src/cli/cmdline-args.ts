/** CmdlineArgs is the data structure for arguments passed via the command line */
export interface CmdlineArgs {
  command: string
  config?: string
  exclude?: string
  files?: string
  format?: string
  'keep-tmp'?: boolean
  offline?: boolean
  workspace?: string
}
