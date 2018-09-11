export interface ConfigFileStructure {
  // $FlowFixMe: the structure of the activityTypes block is user-defined and cannot be statically typed
  actions?: { [key: string]: any }
  defaultFile?: string
  files?: string
  formatter?: string
  publications: any
  useSystemTempDirectory?: boolean
}
