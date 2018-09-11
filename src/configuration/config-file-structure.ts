export interface ConfigFileStructure {
  // $FlowFixMe: the structure of the activityTypes block is user-defined and cannot be statically typed
  actions?: { [key: string]: Object }
  defaultFile?: string
  files?: string
  formatter?: string
  publications: Object
  useSystemTempDirectory?: boolean
}
