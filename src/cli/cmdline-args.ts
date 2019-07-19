/** CmdlineArgs is the data structure for arguments passed via the command line */
export interface CmdlineArgs {
  command: string
  configFileName?: string
  exclude?: string
  fileGlob?: string
  formatterName?: string
  keepTmp?: boolean
  offline?: boolean
  workspace?: string
}
