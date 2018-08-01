// @flow

export type ConfigFileStructure = {
  // $FlowFixMe: the structure of the activityTypes block is user-defined and cannot be statically typed
  actions?: { [string]: Object },
  defaultFile?: string,
  files?: string,
  formatter?: string,
  publications: Object,
  useSystemTempDirectory?: boolean
}
